# artong-vue

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
***
## Amplify env checkout 하기

Amplify env는 prod, stage가 존재

각각 git branch와 대응되며 각 환경에 맞는 aws 인프라(cognito, s3)를 사용

git checkout [branch] 이후
```
amplify status
```
명령어로 Amplify env를 확인하고 일치하지 않을 시
```
amplify env checkout <branch> --restore
```
명령어로 env 맞춰주기.