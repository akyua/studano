# Studano

> **Note**: Projeto para matéria de android na faculdade, será um aplicativo mobile com foco em organização de estudos.
> No aplicativo será disponibilizado funções como pomodoro e linkar cada sessão pomodoro com a matéria que vai estudar
> Possuir um checkout de dias de ofensivas que é semelhante ao Duolingo, um histórico da semana/mes/ano de quantas sessões foram realizadas.
> Sistema de notificação que o usuário vai definir os dias da semana que serão de estudos e qual vai ser a hora e a matéria que vai estudar naquele dia/hora, com isso receberá uma notificação para lembrá-lo.
> Existe a possibilidade do projeto receber funções como mostrar seu perfil, com todos os históricos, talvez a implementação de funções de Flash Cards, mas que serão analisadas com o tempo.

## Tecnologias

- Java/JDK
- Android Studio
- NodeJS

## Como rodar o projeto no windows

Necessário ter instalado as tecnologias citadas na parte de tecnologias

- Abrir variavel de ambiente e ir em [New] -> Variable name: ANDROID_HOME | Variable value: C:\Users\SEU-USUARIO\AppData\Local\Android\Sdk
- Dentro da variavel de ambiente clique em cima da Path e vá em [Edit] -> New -> C:\Users\SEU-USUARIO\AppData\Local\Android\Sdk\platform-tools

Configurar variavel da JDK na variavel de ambiente do sistema.
- Abrir variavel de ambiente e ir em [New] -> Variable name: JAVA_HOME | Variable value: C:\Users\SEU-USUARIO\AppData\Local\Java\JDK... (Vai tar o nome da versao da JDK)
- Dentro da variavel de ambiente clique em cima da Path e vá em [Edit] -> New -> C:\Users\SEU-USUARIO\AppData\Local\Android\Java\JDK...\bin

Dar permissao para emular android:
- Abrir POWERSHEEL e usar -> Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; 

Entrar na pasta do projeto -> cd ANDROID20251
- Usar o comando -> npx.cmd react-native run-android

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





