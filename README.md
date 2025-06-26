# Studano

> **Note**: Projeto para matéria de android na faculdade, será um aplicativo mobile com foco em organização de estudos.

- No aplicativo será disponibilizado funções como pomodoro e linkar cada sessão pomodoro com a matéria que vai estudar
- Possuir um checkout de dias de ofensivas que é semelhante ao Duolingo, um histórico da semana/mes/ano de quantas sessões foram realizadas.
- Sistema de notificação que o usuário vai definir os dias da semana que serão de estudos e qual vai ser a hora e a matéria que vai estudar naquele dia/hora, com isso receberá uma notificação para lembrá-lo.
- Existe a possibilidade do projeto receber funções como mostrar seu perfil, com todos os históricos, talvez a implementação de funções de Flash Cards, mas que serão analisadas com o tempo.

## Tecnologias

- Java/JDK 17
- Android Studio
- NodeJS
- MongoDB

# Release | Download do App

Baixe o arquivo `.apk` da versão mais recente clicando aqui (para android):

[**Download da Última Versão**](https://github.com/akyua/studano/releases/latest)

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
- Criar o: mkdir -p ~/.npm-global
- npm config set prefix '~/.npm-global'
- export PATH="$HOME/.npm-global/bin:$PATH"

### Obrigatorio

Estar usando a versão do Java(JDK) 17.
Para saber sua versão basta :
```bash
java -version
```
Instale o Android Studio para continuar

Depois configure seu .bashrc, com o PATH da SDK do Android Studio.
```bash
vim ~/.bashrc
```
Adicione o PATH da SDK do Android Studio no .bashrc, geralmente é o mesmo que já está no comando:
```bash
export PATH="$HOME/.npm-global/bin:$PATH"
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```
Dê um reload no .bashrc para atualizar:
```bash
source ~/.bashrc
```

Confirme que deu certo e possui o ANDROID_HOME:
```bash
echo $ANDROID_HOME
```

Agora abra a tela no Android studio
Vá em Virtual Device Manager e escolha seu tamanho de tela preferido, recomendo Medium phone

![image](https://github.com/user-attachments/assets/7f339997-edfb-41c1-9aea-92ab7bd6f11c)

Após escolher o tamanho, rode o Android Studio, dando play no tamanho escolhido.

![image](https://github.com/user-attachments/assets/c21b3ece-f6bc-427e-a5cd-8e72d2287647)


Clone este repositório (se ainda não o fez):
```bash
git clone https://github.com/seu-usuario/studano.git
```

Navegue até a pasta do projeto que foi criada:
```bash
cd studano
```

Instale as libs:
```bash
npm i
```

### [Metodo atual de run]
Rode no terminal:
```bash
npm run dev:android
```

--------------------------------------------
### [Metodo antigo de run]
Rode o Metro para dar reload no Projecto:
```bash
npx react-native start --reset-cache
```
Em outro terminal, rode:
```bash
npx react-native run-android 
```
--------------------------------------------


## Padrão de desenvolvimento

As tasks criadas estão nas Issues, mas pode ser visto pelo Projects se você possuir acesso.

Quando decidido qual task deseja fazer, você deve dar Assign para você:

![image](https://github.com/user-attachments/assets/d3b066b0-01ee-41f5-8b6a-0e7c0a783154)

Após isso para desenvolver, recomenda-se que crie uma branch local a partir da main, colocando o nome da task, exemplo: TDEV-1
```bash
git checkout main
git pull
git checkout -b TDEV-1
```

Motivo: Organização de branches da aplicação, para evitar criar conflitos na master e também para saber a qual tarefa se trata aqueles commit, o sufixo de TDEV é referenciado como Tarefa de Desenvolvimento.

Quando a task estiver finalizada, pode dar merge request pra main, só não esqueça de manter a branch da atualizada.
