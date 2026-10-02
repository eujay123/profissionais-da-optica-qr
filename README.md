# 👓 Profissional da Óptica • Multi-Store QR Hub

Plataforma completa de gestão de QR Codes, contatos e localização para a rede de lojas **Profissional da Óptica**.

Projetada para que cada filial física da rede tenha seu próprio QR Code inteligente nos balcões, displays e vitrines, direcionando clientes para:
- 📍 **Como Chegar (GPS)**: Abertura imediata no Google Maps, Waze ou Apple Maps.
- 👁️ **Agendar Exame de Vista**: Conversa direta no WhatsApp com mensagem de agendamento visual.
- 💬 **Falar no WhatsApp**: Atendimento geral da filial.
- 📞 **Ligar para a Loja**: Discagem com 1 toque.
- 📇 **Salvar nos Contatos**: Download do arquivo `.vcf` (vCard RFC 3.0) direto no celular.
- 🕒 **Status Aberto/Fechado em Tempo Real**: Horários calculados dinamicamente.
- 👓 **Serviços Ópticos Oferecidos**: Exame de vista, ajuste de armações, lentes multifocais, laboratório digital.

---

## 🛠️ Tecnologias Utilizadas

- **React 19** + **TypeScript**
- **Vite 8** (Build ultra-rápido)
- **Tailwind CSS v4**
- **qr-code-styling** (Geração de QR codes vetoriais e coloridos com logotipo central)
- **Lucide Icons**
- **Vercel SPA Config** (`vercel.json`)

---

## 🚀 Como Executar Localmente

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor local:
   ```bash
   npm run dev
   ```
3. Acesse no navegador: [http://localhost:5173](http://localhost:5173)

---

## 📦 Como Publicar no GitHub e na Vercel

### Passo 1: Instalar o Git (se ainda não tiver)
No Windows, abra o PowerShell e instale o Git rapidamente:
```powershell
winget install --id Git.Git -e --source winget
```
*(Após instalar, feche e reabra o terminal).*

### Passo 2: Inicializar o Repositório Git
Na pasta do projeto (`qr-rede-lojas`), execute:
```bash
git init
git add .
git commit -m "feat: plataforma Profissional da Optica QR Hub"
git branch -M main
```

### Passo 3: Criar Repositório no GitHub
1. Acesse [github.com/new](https://github.com/new) e crie um repositório (ex: `profissional-da-optica-qr`).
2. Vincule e envie o código:
   ```bash
   git remote add origin https://github.com/SEU_USUARIO/profissional-da-optica-qr.git
   git push -u origin main
   ```

### Passo 4: Deploy em 1 Clique na Vercel
1. Acesse [vercel.com](https://vercel.com) e faça login com sua conta do GitHub.
2. Clique em **"Add New..."** -> **"Project"**.
3. Selecione o repositório `profissional-da-optica-qr`.
4. A Vercel detectará automaticamente o framework como **Vite**. Basta clicar em **"Deploy"**!
5. Em menos de 1 minuto, seu projeto estará no ar com uma URL pública (ex: `https://profissional-da-optica.vercel.app`).

### Passo 5: Ativar a URL nos QR Codes
1. Abra a plataforma já publicada na Vercel.
2. Clique no botão **"Rede & Vercel"** no topo da tela.
3. Cole a sua URL pública gerada pela Vercel e clique em Salvar.
4. Pronto! Todos os QR Codes baixados e displays impressos apontarão para a sua ótica no ar.
