#!/bin/bash

# 스크립트 폴더위치
DIR=../..
# 빌드용 tar, config 파일이 들어있는 폴더 위치
PACKAGE_PATH=build/package
# Docker compose 경로
COMPOSE_PATH=$DIR/server/build/docker-compose.production.yml
# ENV
BUILD_ENV_PATH=.env
BUILD_ENV_VALUE=`cat ${BUILD_ENV_PATH}`

# Docker image 현재 버전
VERSION='1.0.0'
# Docker image 새로운 버전
NEW_VERSION=''

# Docker compose 타입
CONTAINER_TYPE=''
# Docker compose 포트
CONTAINER_PORT=''

main() {
	echo '===== Script Start ====='

	echo '===== Docker version check Start...'
	env_to_variable "${BUILD_ENV_VALUE}"
	docker_version_check
	echo '===== Docker version check end...'

	echo '===== Build Start...'
	mattermost_build
	echo '===== Build End...'

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
	sed -i .backup "s/${1}/${2}/g" $3
}

#Docker image 버전 변경 & Docker compose 설정 변경
docker_version_check() {
	#Docekr image 버전 확인
	if [ ! -e $BUILD_ENV_PATH ]; then
		echo 'Build Failed: NOT FOUND .env ...'

		return 24
	else
		VERSION=$DOCKER_IMAGE_VERSION

		# 버전을 "."로 분리하여 배열로 저장
		IFS='.' read -ra PARTS <<< "$VERSION"

		# 각 부분을 정수로 변환하여 저장
		MAJOR=$((10#${PARTS[0]}))
		MINOR=$((10#${PARTS[1]}))
		PATCH=$((10#${PARTS[2]}))

		# 패치 버전을 1씩 증가
		PATCH=$((PATCH + 1))

		# 버전 각 부분이 최대 값을 넘어가면 상위 버전으로 넘어감
		if ((PATCH > 9)); then
		  PATCH=0
		  MINOR=$((MINOR + 1))

		  if ((MINOR > 9)); then
			MINOR=0
			MAJOR=$((MAJOR + 1))
		  fi
		fi

		# 새 버전을 문자열로 조합
		NEW_VERSION="$MAJOR.$MINOR.$PATCH"
	fi

	#Docker compose type 확인
	if [ "${DOCKER_CONTAINER_TYPE}" = "blue" ]; then
		CONTAINER_TYPE="green"
		CONTAINER_PORT=8061
	else
		CONTAINER_TYPE="blue"
		CONTAINER_PORT=8062
	fi

	variable_to_env "DOCKER_IMAGE_VERSION=${DOCKER_IMAGE_VERSION}" "DOCKER_IMAGE_VERSION=${NEW_VERSION}" $BUILD_ENV_PATH
	variable_to_env "DOCKER_CONTAINER_TYPE=${DOCKER_CONTAINER_TYPE}" "DOCKER_CONTAINER_TYPE=${CONTAINER_TYPE}" $BUILD_ENV_PATH
	variable_to_env "DOCEKR_CONTAINER_PORT=${DOCEKR_CONTAINER_PORT}" "DOCEKR_CONTAINER_PORT=${CONTAINER_PORT}" $BUILD_ENV_PATH
}

# Mattermost 서버 빌드
mattermost_build() {
	# webapp dir 접근
	cd $DIR/webapp/channels

	echo '===== Webapp npm install starting...'
	npm install
	echo '===== Webapp npm install end...'

	sleep 3

	echo '===== Webapp npm build starting...'
	npm run build
	echo '===== Webapp npm build end...'

	# server dir 접근
	cd $DIR/server

	echo '===== Mattermost Server build starting...'
	# linux build
	make build-linux

	# build  파일을 linux 용 tar 로 package
	make package-linux
	echo '===== Mattermost Server build end...'

	mkdir $PACKAGE_PATH
	cp dist/mattermost-team-linux-amd64.tar.gz $PACKAGE_PATH
	cp config/config.json $PACKAGE_PATH
}

main
