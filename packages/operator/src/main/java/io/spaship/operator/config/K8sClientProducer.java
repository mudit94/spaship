package io.spaship.operator.config;

import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.openshift.client.DefaultOpenShiftClient;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.inject.Produces;
import javax.inject.Named;
import javax.inject.Singleton;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Optional;


@Singleton
public class K8sClientProducer {
  private static final Logger LOG = LoggerFactory.getLogger(K8sClientProducer.class);

  @ConfigProperty(name = "application.k8s.namespace")
  Optional<String> nameSpaceFromEnv;

  @ConfigProperty(name = "application.webprop.ns.default")
  Optional<String> defaultWebappNameSpace;

  @Produces
  @Named("namespace")
  String getNamespace() {
    String computedNameSpace = Optional.ofNullable(readNameFromFile()).orElse(whenNameSpaceMetaFileNotFound());
    LOG.info("computed namespace is {}", computedNameSpace);
    return computedNameSpace;
  }
  @Produces
  @Named("defaultNamespaceMT")
  String getMultiTenantDefaultNamespace() {
    var computedNamespace = multiTenantDeploymentDefaultNs();
    LOG.info("computed namespace is {}", computedNamespace);
    return computedNamespace;
  }

  private String readNameFromFile() {
    String ns;
    try {
      ns = new String(Files
        .readAllBytes(Paths.get("/var/run/secrets/kubernetes.io/serviceaccount/namespace")));
    } catch (IOException e) {
      LOG.warn("failed to read namespace from metadata {}", e.getMessage());
      ns = null;
    }
    return ns;
  }

  private String whenNameSpaceMetaFileNotFound() {
    LOG.debug("namespace file does not exists.");
    return nameSpaceFromEnv.orElseGet(() -> {
      LOG.debug("namespace not on environment either! proceeding with ns <default>");
      return "default";
    });
  }

  public String multiTenantDeploymentDefaultNs(){
    return defaultWebappNameSpace.orElseGet(() -> {
      LOG.debug("namespace not on environment either! proceeding with ns <default-ns-not-found>");
      return "default-ns-not-found";
    });
  }

  @Produces
  public KubernetesClient openshiftClient() {
    return new DefaultOpenShiftClient();
  }



}
