# Despliegue en AWS – GroupsApp

## 1. Descripción General

El sistema **GroupsApp** se despliega sobre la infraestructura de **Amazon Web Services (AWS)** utilizando un enfoque basado en microservicios orquestados mediante Kubernetes (**Amazon EKS**).

El objetivo de esta arquitectura es garantizar:

* Escalabilidad horizontal
* Alta disponibilidad
* Tolerancia a fallos
* Desacoplamiento entre componentes

---

## 2. Arquitectura de Red

El despliegue se realiza dentro de una **VPC (Virtual Private Cloud)** que encapsula todos los recursos del sistema, proporcionando aislamiento y control de red.

### Componentes principales:

* **Application Load Balancer (ALB)**
  Punto de entrada al sistema. Recibe el tráfico HTTP/HTTPS desde los clientes.

* **Ingress Controller (NGINX)**
  Gestiona el enrutamiento interno dentro del clúster de Kubernetes hacia los microservicios correspondientes.

---

## 3. Capa de Cómputo – Amazon EKS

El sistema se ejecuta sobre un clúster de Kubernetes gestionado mediante **Amazon EKS**, donde cada microservicio se despliega como un conjunto de pods.

### Microservicios desplegados:

* Auth Service
* User & Group Service
* Messaging Service
* Media Service
* Presence Service
* Notification Service

Cada servicio cuenta con:

* Deployment (gestión de réplicas)
* Service (exposición interna)
* Autoescalado mediante HPA (Horizontal Pod Autoscaler)

---

## 4. Capa de Datos

Se utilizan diferentes tecnologías según el tipo de dato:

### 4.1 Base de datos relacional

* **Amazon RDS (PostgreSQL)**
  Almacena información persistente como usuarios, grupos y mensajes.

### 4.2 Almacenamiento en memoria

* **Amazon ElastiCache (Redis)**
  Utilizado para:

  * Estado de presencia (online/offline)
  * Cache de consultas frecuentes

### 4.3 Almacenamiento de archivos

* **Amazon S3**
  Almacena archivos multimedia (imágenes, documentos, etc.), evitando sobrecargar la base de datos.

---

## 5. Capa de Mensajería

* **Amazon MSK (Managed Streaming for Kafka)**

Se utiliza para implementar una arquitectura orientada a eventos, permitiendo:

* Desacoplar los microservicios
* Procesar eventos de manera asíncrona
* Mejorar la escalabilidad del sistema

Ejemplos de eventos:

* `message.created`
* `message.read`
* `user.online`
* `file.uploaded`

---

## 6. Servicios de Soporte

Dentro del clúster EKS se despliegan servicios auxiliares:

* **Consul**
  Servicio de descubrimiento y configuración distribuida

* **Prometheus**
  Recolección de métricas del sistema

* **Grafana**
  Visualización de métricas

---

## 7. Observabilidad

* **Amazon CloudWatch**
  Centraliza logs y eventos del sistema

Esto permite:

* Monitoreo en tiempo real
* Detección de fallos
* Análisis de comportamiento del sistema

---

## 8. Flujo de Peticiones

El flujo de una petición típica es el siguiente:

1. El usuario realiza una solicitud desde el cliente (web/móvil)
2. La solicitud llega al **Application Load Balancer**
3. El ALB redirige al **Ingress Controller**
4. El Ingress enruta la petición al microservicio correspondiente
5. El microservicio interactúa con:

   * Base de datos (RDS)
   * Cache (Redis)
   * Sistema de eventos (Kafka)
   * Almacenamiento (S3)

---

## 9. Escalabilidad y Alta Disponibilidad

El sistema soporta:

### Escalabilidad

* Autoescalado de pods (HPA)
* Escalabilidad de Kafka (MSK)

### Alta disponibilidad

* Despliegue en múltiples zonas (Multi-AZ)
* Réplicas de servicios en Kubernetes

### Tolerancia a fallos

* Reemplazo automático de pods
* Persistencia de eventos en Kafka

---

## 10. Justificación del Diseño

Esta arquitectura fue seleccionada porque:

* Permite un alto desacoplamiento entre componentes
* Facilita el escalado independiente de cada servicio
* Mejora la resiliencia del sistema ante fallos
* Soporta cargas variables de usuarios

---

## 11. Conclusión

El despliegue en AWS mediante EKS proporciona una base sólida para construir un sistema de mensajería distribuido, escalable y altamente disponible, alineado con los principios de arquitecturas modernas basadas en microservicios y eventos.
