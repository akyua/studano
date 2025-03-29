# Projeto ?

> **Note**: Projeto para matéria de android na faculdade, ainda não temos certeza oque será feito

## Tecnologias

- Java/JDK
- Android Studio
- NodeJS

## Como rodar o projeto no windows

Necessário ter instalado as tecnologias citadas na parte de tecnologias

Abrir variavel de ambiente e ir em [New] -> Variable name: ANDROID_HOME | Variable value: C:\Users\SEU-USUARIO\AppData\Local\Android\Sdk
Dentro da variavel de ambiente clique em cima da Path e vá em [Edit] -> New -> C:\Users\SEU-USUARIO\AppData\Local\Android\Sdk\platform-tools

Configurar variavel da JDK na variavel de ambiente do sistema.
Abrir variavel de ambiente e ir em [New] -> Variable name: JAVA_HOME | Variable value: C:\Users\SEU-USUARIO\AppData\Local\Java\JDK... (Vai tar o nome da versao da JDK)
Dentro da variavel de ambiente clique em cima da Path e vá em [Edit] -> New -> C:\Users\SEU-USUARIO\AppData\Local\Android\Java\JDK...\bin

Dar permissao para emular android:
Abrir POWERSHEEL e usar -> Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; 

Entrar na pasta do projeto -> cd ANDROID20251
Usar o comando -> npx.cmd react-native run-android

## Como rodar o projeto no linux

Necessário ter instalado as tecnologias citadas na parte de tecnologias.

(Opcional) - Configurar para usar npm sem problemas de uso de sudo.
Criar o: mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH="$HOME/.npm-global/bin:$PATH"

(Obrigatorio)
Abrir o tela no Android studio

Entrar na pasta do projeto e usar:
npx-react-native run-android





