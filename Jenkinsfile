pipeline {
    agent any
    stages {
        stage('Pull latest code') {
            steps {
                sh '''
                cd ~/cicdproject
                git pull origin main
                '''
            }
}

        stage('Rebuild and Deploy') {
            steps {
                sh '''
                cd ~/cicdproject
                docker compose down
                docker compose build --no-cache
                docker compose up -d
                '''
            }
        }

    }
}