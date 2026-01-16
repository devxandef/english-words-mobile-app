# English Words Mobile App

##  Visão Geral do Projeto

Aplicativo mobile desenvolvido em React Native para aprendizado de palavras em inglês. O app permite visualizar uma lista extensa de palavras, consultar definições, fonética e exemplos de uso, além de gerenciar favoritos e histórico de palavras visualizadas.

**Objetivo**: Criar uma aplicação mobile completa com funcionalidades de aprendizado de vocabulário, autenticação de usuários e sincronização de dados na nuvem.

---

##  Como Executar o Projeto

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** >= 20.x ([Download](https://nodejs.org/))
- **npm** ou **yarn** (geralmente vem com Node.js)
- **React Native CLI** (opcional, mas recomendado)
  ```bash
  npm install -g react-native-cli
  ```

#### Para Android:
- **Java Development Kit (JDK)** 17 ou superior
- **Android Studio** com Android SDK
- **Android SDK Platform** 33 ou superior
- **Android Virtual Device (AVD)** ou dispositivo físico com USB debugging habilitado

#### Para iOS (apenas macOS):
- **Xcode** 14 ou superior
- **CocoaPods** 
  ```bash
  sudo gem install cocoapods
  ```
- **iOS Simulator** ou dispositivo físico

---

### Instalação

1. **Clone o repositório** (se ainda não tiver):
   ```bash
   git clone <url-do-repositorio>
   cd english-words-mobile-app/EnglishWordsApp
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Instale as dependências nativas do iOS** (apenas macOS):
   ```bash
   cd ios
   pod install
   cd ..
   ```

---

### Configuração do Firebase

O projeto já está configurado com Firebase para autenticação e sincronização de dados. Os arquivos de configuração já estão incluídos:

- **Android**: `android/app/google-services.json` 

### Executando o Projeto

#### Opção 1: Executar no Android

1. **Inicie o Metro Bundler** (em um terminal):
   ```bash
   npm start
   ```

2. **Em outro terminal, execute o app Android**:
   ```bash
   npm run android
   ```



#### Opção 2: Executar no iOS (apenas macOS)

1. **Inicie o Metro Bundler** (em um terminal):
   ```bash
   npm start
   ```

2. **Em outro terminal, execute o app iOS**:
   ```bash
   npm run ios
   ```

   Ou se preferir especificar um simulador:
   ```bash
   npx react-native run-ios --simulator="iPhone 15"
   ```

---

### Scripts Disponíveis

O projeto inclui os seguintes scripts npm:

| Script | Descrição |
|--------|-----------|
| `npm start` | Inicia o Metro Bundler (servidor de desenvolvimento) |
| `npm run android` | Compila e executa o app no Android |
| `npm run ios` | Compila e executa o app no iOS |
| `npm test` | Executa os testes unitários |
| `npm run test:watch` | Executa os testes em modo watch |
| `npm run test:coverage` | Executa os testes com relatório de cobertura |
| `npm run test:ci` | Executa os testes em modo CI (com cobertura) |
| `npm run lint` | Executa o linter ESLint |

---

### Troubleshooting

#### Problemas Comuns

**1. Erro "Metro bundler não encontrado"**
```bash
# Limpe o cache e reinstale
npm start -- --reset-cache
```

**2. Erro de dependências nativas no Android**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

**3. Erro de dependências nativas no iOS**
```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

**4. Erro "Unable to resolve module"**
```bash
# Limpe node_modules e reinstale
rm -rf node_modules
npm install
```

**5. Porta 8081 já em uso (Metro Bundler)**
```bash
# Encontre e mate o processo
lsof -ti:8081 | xargs kill -9
# Ou use outra porta
npm start -- --port 8082
```

**6. Problemas com Firebase**
- Verifique se os arquivos de configuração do Firebase estão corretos
- Certifique-se de que o Firebase está habilitado no console do Firebase
- Verifique as regras de segurança do Firestore

---

### Estrutura de Desenvolvimento Recomendada

Para uma melhor experiência de desenvolvimento:

1. **Terminal 1**: Metro Bundler
   ```bash
   npm start
   ```

2. **Terminal 2**: Executar o app
   ```bash
   npm run android  # ou npm run ios
   ```

3. **Terminal 3** (opcional): Testes em watch mode
   ```bash
   npm run test:watch
   ```

---

### Hot Reload

O React Native suporta **Fast Refresh** por padrão. Quando você salvar alterações nos arquivos, o app será atualizado automaticamente. Se não funcionar:

- **Android**: Pressione `R` duas vezes ou agite o dispositivo
- **iOS**: Pressione `Cmd + R` no simulador

---

##  Arquitetura do Sistema

### Arquitetura em Camadas

O projeto segue uma arquitetura em camadas bem definida, separando responsabilidades:

```
┌─────────────────────────────────────┐
│         CAMADA DE APRESENTAÇÃO      │
│  (Screens, Components, Navigation)  │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│         CAMADA DE CONTEXTO           │
│      (AuthContext - State Mgmt)     │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│         CAMADA DE SERVIÇOS           │
│  (API, Storage, Cache, Firestore)   │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│      CAMADA DE DADOS/STORAGE         │
│  (AsyncStorage, Firestore, Cache)   │
└─────────────────────────────────────┘
```

### Fluxo de Dados

1. **Autenticação**: Context API gerencia estado global de autenticação
2. **Armazenamento Híbrido**: Dados salvos localmente (AsyncStorage) e sincronizados com Firestore
3. **Cache Inteligente**: Sistema de cache em memória para otimizar requisições à API
4. **Navegação Condicional**: Navegação baseada no estado de autenticação (AuthStack vs AppStack)

### Padrões Arquiteturais Utilizados

- **Service Layer Pattern**: Serviços isolados para cada responsabilidade (API, Storage, Cache, Auth, Firestore)
- **Context API Pattern**: Gerenciamento de estado global para autenticação
- **Repository Pattern**: Abstração da camada de dados através dos serviços
- **Singleton Pattern**: Instâncias únicas dos serviços (apiService, storageService, etc.)

---

## 🛠️ Escolhas de Tecnologias e Justificativas

### Core Framework

#### **React Native 0.83.1**
- **Por quê?**: Framework híbrido que permite desenvolvimento multiplataforma (iOS e Android) com código único
- **Benefícios**: 
  - Desenvolvimento mais rápido comparado a apps nativos
  - Grande comunidade e ecossistema
  - Performance próxima de apps nativos
  - Hot reload para desenvolvimento ágil

#### **TypeScript 5.8.3**
- **Por quê?**: Tipagem estática para maior segurança e manutenibilidade
- **Benefícios**:
  - Detecção de erros em tempo de desenvolvimento
  - Melhor autocomplete e IntelliSense
  - Documentação implícita através de tipos
  - Refatoração mais segura

#### **React 19.2.0**
- **Por quê?**: Versão mais recente com melhorias de performance
- **Benefícios**: Hooks modernos, melhor gerenciamento de estado, otimizações de renderização

---

### Navegação e UI

#### **React Navigation 7.x**
- **Por quê?**: Biblioteca padrão e mais madura para navegação em React Native
- **Benefícios**:
  - Navegação baseada em stack (ideal para fluxo de autenticação)
  - Suporte nativo a gestos e animações
  - Integração perfeita com React Native
  - Navegação condicional baseada em estado

#### **Styled Components 6.3.6**
- **Por quê?**: CSS-in-JS permite estilização coesa e reutilizável
- **Benefícios**:
  - Componentes auto-contidos (estilos junto com lógica)
  - Temas dinâmicos e props condicionais
  - Melhor organização do código
  - TypeScript support nativo

#### **React Native Vector Icons**
- **Por quê?**: Biblioteca completa de ícones para interfaces modernas
- **Benefícios**: Grande variedade de ícones, fácil customização, performance otimizada

---

### Armazenamento e Backend

#### **AsyncStorage**
- **Por quê?**: Armazenamento local persistente e assíncrono
- **Benefícios**:
  - Funciona offline
  - Acesso rápido aos dados
  - Ideal para cache e dados temporários
  - API simples e direta

#### **Firebase Authentication**
- **Por quê?**: Solução completa e gerenciada de autenticação
- **Benefícios**:
  - Implementação rápida (email/senha)
  - Segurança gerenciada pelo Firebase
  - Suporte a múltiplos provedores (extensível)
  - Persistência de sessão automática

#### **Cloud Firestore**
- **Por quê?**: Banco de dados NoSQL em tempo real
- **Benefícios**:
  - Sincronização automática entre dispositivos
  - Escalabilidade automática
  - Queries flexíveis
  - Offline support nativo
  - Estrutura de dados por usuário (collections aninhadas)

#### **Axios 1.13.2**
- **Por quê?**: Cliente HTTP robusto e configurável
- **Benefícios**:
  - Interceptors para tratamento de erros
  - Cancelamento de requisições
  - Melhor tratamento de erros que fetch nativo
  - Suporte a TypeScript

---

### Funcionalidades Especiais

#### **React Native Sound**
- **Por quê?**: Reprodução de áudio para pronúncia das palavras
- **Benefícios**: API simples, suporte a múltiplos formatos, controle de playback

#### **Free Dictionary API**
- **Por quê?**: API pública e gratuita para definições de palavras
- **Benefícios**: Dados completos (fonética, significados, exemplos), sem necessidade de API key

---

### Testes

#### **Jest 29.6.3**
- **Por quê?**: Framework de testes padrão para React Native
- **Benefícios**:
  - Configuração zero
  - Snapshot testing
  - Mocking poderoso
  - Cobertura de código integrada

#### **React Native Testing Library**
- **Por quê?**: Biblioteca focada em testes do ponto de vista do usuário
- **Benefícios**:
  - Testes mais próximos do comportamento real
  - Queries semânticas
  - Melhor prática para testes de componentes React

---

##  Estrutura do Código

```
EnglishWordsApp/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Icon/            # Ícones customizados
│   │   ├── LoadingSpinner/  # Feedback visual de carregamento
│   │   ├── TabBar/          # Navegação por abas
│   │   ├── UserAvatar/      # Avatar do usuário com logout
│   │   └── WordCard/        # Card de palavra (grid)
│   │
│   ├── screens/              # Telas da aplicação
│   │   ├── LoginScreen/      # Autenticação
│   │   ├── SignUpScreen/     # Cadastro
│   │   ├── WordListScreen/   # Lista principal (com tabs)
│   │   └── WordDetailScreen/ # Detalhes da palavra
│   │
│   ├── services/            # Camada de serviços
│   │   ├── api.ts           # Cliente da Free Dictionary API
│   │   ├── auth.ts          # Serviço de autenticação Firebase
│   │   ├── cache.ts         # Cache em memória (TTL 24h)
│   │   ├── firestore.ts     # Sincronização com Firestore
│   │   └── storage.ts       # Armazenamento local (AsyncStorage)
│   │
│   ├── contexts/            # Contextos React
│   │   └── AuthContext.tsx  # Estado global de autenticação
│   │
│   ├── types/               # Definições TypeScript
│   ├── constants/           # Constantes (cores, espaçamentos)
│   └── utils/               # Utilitários (áudio)
│
├── __tests__/               # Testes unitários
└── App.tsx                   # Componente raiz e navegação
```

### Princípios de Organização

1. **Separação por Responsabilidade**: Cada serviço tem uma responsabilidade única
2. **Componentes Modulares**: Cada componente em sua própria pasta com estilos e tipos
3. **Tipagem Forte**: Interfaces TypeScript para todos os dados
4. **Constantes Centralizadas**: Cores, espaçamentos e configurações em um único lugar

---

##  Fluxo de Funcionalidades Principais

### 1. Autenticação e Sincronização

```
Login/SignUp
    ↓
Firebase Auth valida credenciais
    ↓
AuthContext detecta mudança de estado
    ↓
StorageService.setUserId(userId)
    ↓
Sincronização bidirecional:
  - Local → Firestore (upload)
  - Firestore → Local (download e merge)
    ↓
Dados unificados disponíveis
```

### 2. Listagem de Palavras

```
App inicia
    ↓
WordListScreen carrega
    ↓
API Service busca dicionário (cache em memória)
    ↓
Lista carregada em lotes (30 palavras por vez)
    ↓
Infinite scroll carrega mais itens
    ↓
Usuário clica em palavra
    ↓
Adiciona ao histórico (local + Firestore)
    ↓
Navega para WordDetailScreen
```

### 3. Busca de Definição

```
Usuário visualiza palavra
    ↓
Verifica cache em memória (TTL 24h)
    ↓
Se não encontrado, busca na Free Dictionary API
    ↓
Armazena no cache
    ↓
Exibe definição, fonética e exemplos
    ↓
Botão de áudio disponível (React Native Sound)
```

### 4. Favoritos e Histórico

```
Usuário marca como favorito
    ↓
StorageService.addFavorite()
    ↓
Salva localmente (AsyncStorage) - acesso rápido
    ↓
Se usuário logado, salva no Firestore - sincronização
    ↓
Merge inteligente ao fazer login em outro dispositivo
```

---

##  Otimizações de Performance

### 1. **Cache em Memória**
- TTL de 24 horas para definições de palavras
- Reduz requisições desnecessárias à API
- Resposta instantânea para palavras já consultadas

### 2. **Paginação e Lazy Loading**
- Carregamento de 30 itens por vez
- Infinite scroll para melhor UX
- `removeClippedSubviews` e `maxToRenderPerBatch` no FlatList

### 3. **Armazenamento Híbrido**
- AsyncStorage para acesso rápido offline
- Firestore para sincronização na nuvem
- Merge inteligente de dados locais e remotos

### 4. **Otimizações de Renderização**
- `React.memo` para componentes puros
- `useCallback` e `useMemo` para evitar re-renders
- Renderização condicional

### 5. **Sincronização Inteligente**
- Sincronização apenas quando necessário
- Merge de dados sem perda de informação
- Suporte offline com sync posterior

---

##  Decisões de Design Importantes

### Arquitetura

1. **Context API vs Redux**: Escolhido Context API por ser mais simples e suficiente para o escopo (apenas autenticação)

2. **Service Layer**: Serviços isolados facilitam testes, manutenção e reutilização

3. **Armazenamento Híbrido**: Combinação AsyncStorage + Firestore oferece melhor experiência (offline + sync)

### UI/UX

1. **Styled Components**: Escolhido para manter estilos coesos e próximos dos componentes

2. **Grid de 3 Colunas**: Seguindo wireframe, otimiza uso de espaço em telas mobile

3. **Navegação por Tabs**: Facilita acesso rápido a WordList, History e Favorites

### Dados

1. **Cache em Memória**: Mais rápido que AsyncStorage para dados temporários (definições)

2. **Lista de Palavras em Memória**: Carregada uma vez e mantida em memória para scroll infinito fluido

3. **Limite de Histórico**: Últimas 100 palavras visualizadas para evitar crescimento excessivo

---

##  Funcionalidades Implementadas

### Obrigatórias
-  Lista de palavras com rolagem infinita
-  Visualização de palavra, significados e fonética
-  Salvar/remover palavra como favorito
-  Histórico de palavras visualizadas
-  Cache de requisições (TTL 24h)
-  Layout baseado no wireframe

### Diferenciais
-  Autenticação de usuários (Firebase Auth)
-  Sincronização na nuvem (Firestore)
-  Tocador de áudio (React Native Sound)
-  Testes unitários (Jest + Testing Library)
-  Interface moderna e responsiva
-  Otimizações de performance

---

##  Métricas e Qualidade

- **Cobertura de Testes**: Configurada para mínimo de 60%
- **TypeScript**: 100% do código tipado
- **Linting**: ESLint configurado
- **Performance**: Otimizações de renderização e cache
- **Offline Support**: Funcionalidade básica com AsyncStorage

---

## Conclusão

O projeto demonstra uma arquitetura bem estruturada, com separação clara de responsabilidades, escolhas tecnológicas fundamentadas e otimizações de performance. A arquitetura em camadas com interfaces bem definidas permite a extensão de funcionalidades e facilita a troca de bibliotecas, já que toda comunicação entre camadas é feita através de interfaces, garantindo baixo acoplamento e alta manutenibilidade.

**Principais Destaques**:
- Arquitetura escalável e manutenível com interfaces bem definidas
- Facilidade para extensão de funcionalidades e troca de tecnologias
- Código tipado e testado (TypeScript + Jest)
- Performance otimizada com cache e lazy loading
- Experiência de usuário fluida com suporte offline
- Sincronização inteligente de dados entre dispositivos


## Links apresentação

https://drive.google.com/file/d/1wu1LpcA1a5dzzRSgbpqR8t90hDGccKmZ/view?usp=sharing
https://drive.google.com/file/d/11FRhtm03EzeUNIRF7BieDKDbR5vCqA0R/view?usp=sharing