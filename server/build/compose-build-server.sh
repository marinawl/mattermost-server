#!/bin/bash

# Docker compose 경로
COMPOSE_PATH=docker-compose-server.production.yml
# ENV
BUILD_ENV_PATH=.env
BUILD_ENV_VALUE=`cat ${BUILD_ENV_PATH}`

# Docker image 현재 버전
VERSION='0.0.1'

main() {
  echo '===== Script Start ====='

  echo '===== env check Start...'
  env_to_variable "${BUILD_ENV_VALUE}"
  echo '===== env check end...'

  echo '===== Docker Image Build Start...'
  docker_image_build
  echo '===== Docker Image Build End...'

  echo '===== Docker Compose Start...'
  docker_build
  echo '===== Docker Compose Build End...'

  echo '===== Script End ====='
}

# env 변수값을 전역변수로 저장
env_to_variable()
{
  for env in $1; do
    # \r 전부 제거
    env=$(echo $env | tr -d '\r')
    IFS="=" read -r key value <<< "$env"

    eval $key=$value
  done
}

# 전역변수를 env 값으로 변경
variable_to_env()
{
  # local 에서 테스트 할 시 .backup 을 붙여야 env 값 변경 가능
  #sed -i .backup "s/${1}/${2}/g" $3
  sed -i "s/${1}/${2}/g" $3
}

# docker hub 에서 img pull 작업
docker_image_build() {
  while true; do
    read -p "다운 받을 Docker image 버전을 입력해주세요 [ ex) 0.0.1 ]: " VERSION

    # 버전 타입이 올바른지 체크
    echo $VERSION | egrep -q "^[0-9]+\.[0-9]+\.[0-9]+$"

    if [ $? == 0 ]; then
      # 올바른 버전 타입인 경우
      # 입력한 버전을 다운 받았는지 체크 ( 존재하면 id 를 반환 )
      DOCKER_ID=$(docker images -q ${DOCKER_IMAGE_NM}:$VERSION)

      if [ -n "$DOCKER_ID" ]; then
        # 다운받은 적 있는 image 일 경우 break ( 이미 존재하니까 compose 만 실행 )
        echo "Local Docker image 에 $VERSION 버전 image 가 존재합니다."
        break
      else
        # 다운받은 적이 없는 image 일 경우
        echo "Local Docker image 에 $VERSION 버전 image 가 존재하지 않습니다."

        # docker hub 로그인
        echo "Docker hub 로그인 시도"
        docker login -u ${DOCKER_HUB_ID} -p ${DOCKER_HUB_PW}
        DOCKER_LOGIN_CODE=$?

        if [ $DOCKER_LOGIN_CODE -eq 0 ]; then
          echo "Docker hub 로그인 성공"
          echo "Docker hub 에서 $VERSION 버전 image 가 존재하는지 체크"

          # docker image pull 작업
          docker pull ${DOCKER_IMAGE_NM}:$VERSION
          DOCKER_PULL_CODE=$?

          if [ $DOCKER_PULL_CODE -eq 0 ]; then
            echo "Docker hub 에서 $VERSION 버전 image 를 Pull 받았습니다."
            break
          else
            echo "Docker hub 에 $VERSION 버전 image 가 존재하지 않습니다."
            echo "Docker hub 에 올라가 있는 버전을 확인해주세요"
            exit 24; # 존재하지 않는 version
          fi

        else
          echo "Docker hub 로그인 실패"
          echo "env 에 설정된 ID, PW 를 확인해주세요."

          exit 24; # id, pw 오류
        fi

        break
      fi
    else
      echo "잘못된 버전 타입입니다."
      echo "버전 타입을 확인해주세요. ex) 0.0.1 "
    fi
  done
}

# Docker image & Docker Container 생성
docker_build() {
  echo "===== env 버전 정보를 동기화 합니다. "
  variable_to_env "DOCKER_IMAGE_VERSION=.*" "DOCKER_IMAGE_VERSION=${VERSION}" $BUILD_ENV_PATH

  sleep 3

  # 이전 컨테이너 종료
  echo "===== ${DOCKER_CONTAINER_NM} 기존 컨테이너를 삭제 및 종료합니다. "
  docker compose --env-file .env -p ${DOCKER_CONTAINER_NM} -f ${COMPOSE_PATH} down

  sleep 3

  # Docker container 생성
  echo "===== ${DOCKER_CONTAINER_NM} 새로운 컨테이너 업로드 합니다."
  docker compose --env-file .env -p ${DOCKER_CONTAINER_NM} -f ${COMPOSE_PATH} up -d
}

#test

main
