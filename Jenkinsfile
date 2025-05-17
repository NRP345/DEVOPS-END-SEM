pipeline {
agent any

environment {
DOCKER_IMAGE =  'nrpatil654/devops-end-sem:latest' // Replace with your Docker Hub image
DOCKER_CREDENTIALS_ID = 'docker-hub-credentials' // Jenkins credential ID for Docker Hub
KUBECONFIG_CREDENTIALS_ID = 'kubeconfig-secret' // Optional: Jenkins secret text or file credential
}

stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/NRP345/DEVOPS-END-SEM.git'
            }
        }


stage('Build Docker Image') {
  steps {
    script {
      sh 'docker build -t $DOCKER_IMAGE .'
    }
  }
}

stage('Push Docker Image') {
  steps {
    withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
      script {
        sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
        sh 'docker push $DOCKER_IMAGE'
      }
    }
  }
}

stage('Deploy to Kubernetes') {
  steps {
    withCredentials([file(credentialsId: "${KUBECONFIG_CREDENTIALS_ID}", variable: 'KUBECONFIG_FILE')]) {
      script {
        sh '''
          export KUBECONFIG=$KUBECONFIG_FILE
          kubectl apply -f deployment.yaml
          kubectl apply -f service.yaml
        '''
      }
    }
  }
}

}

post {
success {
echo 'Pipeline executed successfully.'
}
failure {
echo 'Pipeline failed.'
}
}
}
