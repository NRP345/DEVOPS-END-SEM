pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'nrpatil654/devops-end-sem:latest' // Docker image
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'  // Jenkins Docker Hub credentials
        KUBECONFIG_CREDENTIALS_ID = 'kubeconfig-secret'   // Jenkins kubeconfig credentials
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
                        sh '''
                            echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                            docker push $DOCKER_IMAGE
                        '''
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
                            kubectl apply --validate=false -f deployment.yaml
                            kubectl apply --validate=false -f service.yaml
                        '''
                    }
                }
            }
        }

        stage('Ansible Deploy') {
            steps {
                sh '''
                    cd ansible
                    ansible-playbook -i hosts.ini deploy.yaml
                '''
            }
        }

        stage('Deploy ELK') {
            steps {
                withCredentials([file(credentialsId: "${KUBECONFIG_CREDENTIALS_ID}", variable: 'KUBECONFIG_FILE')]) {
                    script {
                        sh '''
                            export KUBECONFIG=$KUBECONFIG_FILE
                            kubectl apply --validate=false -f k8s/elk/elasticsearch.yaml
                            kubectl apply --validate=false -f k8s/elk/kibana.yaml
                            kubectl apply --validate=false -f k8s/elk/filebeat.yaml
                        '''
                    }
                }
            }
        }

    }

    post {
        success {
            echo '✅ Pipeline executed successfully.'
        }
        failure {
            echo '❌ Pipeline failed.'
        }
    }
}
