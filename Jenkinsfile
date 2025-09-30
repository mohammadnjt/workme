pipeline {
    agent any
    
    environment {
        IMAGE_NAME = 'islio'
        CONTAINER_NAME = 'islio-app'
        APP_PORT = '3000'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'دریافت سورس کد از Git...'
                checkout scm
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo 'ساخت Docker Image...'
                script {
                    // استفاده از BUILD_ID برای versioning
                    sh """
                        docker build -t ${IMAGE_NAME}:${env.BUILD_ID} .
                        docker tag ${IMAGE_NAME}:${env.BUILD_ID} ${IMAGE_NAME}:latest
                    """
                }
            }
        }
        
        stage('Stop Old Container') {
            steps {
                echo 'متوقف کردن کانتینر قبلی...'
                script {
                    sh '''
                        docker stop ${CONTAINER_NAME} || true
                        docker rm ${CONTAINER_NAME} || true
                    '''
                }
            }
        }
        
        stage('Deploy') {
            steps {
                echo 'دپلوی اپلیکیشن...'
                script {
                    sh """
                        docker run -d \
                          --name ${CONTAINER_NAME} \
                          --restart unless-stopped \
                          -p ${APP_PORT}:3000 \
                          ${IMAGE_NAME}:latest
                    """
                }
            }
        }
        
        stage('Health Check') {
            steps {
                echo 'بررسی سلامت اپلیکیشن...'
                script {
                    sh '''
                        echo "منتظر راه‌اندازی اپلیکیشن..."
                        sleep 20
                        
                        echo "بررسی وضعیت کانتینر..."
                        docker ps | grep ${CONTAINER_NAME}
                        
                        echo "بررسی لاگ‌ها..."
                        docker logs ${CONTAINER_NAME} --tail 30
                        
                        echo "تست اتصال به اپلیکیشن..."
                        for i in 1 2 3 4 5; do
                            if curl -f http://localhost:${APP_PORT} 2>/dev/null; then
                                echo "✅ اپلیکیشن با موفقیت در دسترس است"
                                exit 0
                            fi
                            echo "تلاش $i از 5 - در انتظار..."
                            sleep 5
                        done
                        echo "⚠️ اپلیکیشن پاسخ نمی‌دهد اما کانتینر در حال اجراست"
                        exit 0
                    '''
                }
            }
        }
        
        stage('Cleanup') {
            steps {
                echo 'پاکسازی تصاویر قدیمی...'
                script {
                    sh '''
                        # حذف تصاویر بدون تگ
                        docker image prune -f
                        
                        # حذف تصاویر قدیمی (نگه داشتن 3 نسخه آخر)
                        docker images ${IMAGE_NAME} --format "{{.ID}} {{.Tag}}" | \
                        grep -v latest | \
                        tail -n +4 | \
                        awk '{print $1}' | \
                        xargs -r docker rmi -f || true
                    '''
                }
            }
        }
    }
    
    post {
        success {
            echo '✅ دپلوی با موفقیت انجام شد!'
            echo "🔗 اپلیکیشن در دسترس است: http://localhost:${APP_PORT}"
        }
        failure {
            echo '❌ خطا در فرآیند دپلوی!'
            script {
                sh '''
                    echo "======= نمایش لاگ‌های کامل ======="
                    docker logs ${CONTAINER_NAME} || echo "کانتینر وجود ندارد"
                    
                    echo "======= بررسی تصاویر موجود ======="
                    docker images | grep ${IMAGE_NAME} || true
                    
                    echo "======= پاکسازی در صورت خطا ======="
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                '''
            }
        }
        always {
            echo 'پایان pipeline'
        }
    }
}