# OpenGuard - Frontend Development Roadmap

## 🎨 Design System

### Color Palette (Suggestion)
```css
/* Primary - Solana-inspired purple */
--primary: #9945FF;
--primary-dark: #7526D8;
--primary-light: #B565FF;

/* Accent - Telegram blue */
--accent: #0088CC;
--accent-dark: #006699;

/* Neutrals */
--bg-dark: #0a0a0a;
--bg-card: #1a1a1a;
--text-primary: #ededed;
--text-secondary: #999999;

/* Status colors */
--success: #14F195;
--error: #FF4444;
--warning: #FFB800;
```

### Typography
```css
--font-heading: 'Geist Sans', sans-serif;
--font-body: 'Geist Sans', sans-serif;
--font-mono: 'Geist Mono', monospace;

/* Sizes */
--text-xs: 0.75rem;   /* 12px */
--text-sm: 0.875rem;  /* 14px */
--text-base: 1rem;    /* 16px */
--text-lg: 1.125rem;  /* 18px */
--text-xl: 1.25rem;   /* 20px */
--text-2xl: 1.5rem;   /* 24px */
--text-3xl: 1.875rem; /* 30px */
--text-4xl: 2.25rem;  /* 36px */
--text-5xl: 3rem;     /* 48px */
```

### Spacing
```css
/* Use Tailwind's default spacing scale */
/* 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96 */
```

---

## 📄 Page Breakdown

### 1. Landing Page (`app/page.tsx`)

#### Section 1: Hero
```tsx
<HeroSection>
  <Badge>🔒 Powered by Solana</Badge>
  <H1>Token-Gate Your Telegram Communities</H1>
  <Subtitle>
    Require users to hold specific tokens before joining your Telegram group.
    Automated verification. No manual work.
  </Subtitle>
  <CTAButtons>
    <PrimaryButton href="#how-it-works">Learn More</PrimaryButton>
    <SecondaryButton href="#setup">Get Started</SecondaryButton>
  </CTAButtons>
  <HeroVisual>
    {/* Animated graphic showing token → Telegram flow */}
  </HeroVisual>
</HeroSection>
```

**Design notes**:
- Large, bold headline
- Animated gradient background
- Floating elements (tokens, logos)
- Responsive: stack on mobile

---

#### Section 2: Problem/Solution
```tsx
<TwoColumnSection>
  <ProblemColumn>
    <Icon>❌</Icon>
    <H3>The Problem</H3>
    <List>
      - Spam bots flooding your group
      - Non-holders getting access
      - Manual verification takes hours
      - Users sell tokens after joining
    </List>
  </ProblemColumn>
  
  <SolutionColumn>
    <Icon>✅</Icon>
    <H3>OpenGuard Solution</H3>
    <List>
      - Automated token verification
      - Real-time balance checking
      - One-click joining for holders
      - Continuous monitoring (every 15 min)
    </List>
  </SolutionColumn>
</TwoColumnSection>
```

---

#### Section 3: How It Works
```tsx
<HowItWorksSection id="how-it-works">
  <SectionHeader>
    <H2>How It Works</H2>
    <Subtitle>Three simple steps to secure your community</Subtitle>
  </SectionHeader>
  
  <Steps>
    <Step number={1}>
      <Icon>🤖</Icon>
      <H3>Setup Bot</H3>
      <Description>
        Add @OpenGuardBot to your Telegram group.
        Run /setup and configure your token requirements.
      </Description>
      <CodeSnippet>/setup</CodeSnippet>
    </Step>
    
    <Step number={2}>
      <Icon>🔗</Icon>
      <H3>Link Portal</H3>
      <Description>
        Paste the /link command in your target channel.
        Get a shareable join button instantly.
      </Description>
      <CodeSnippet>/link a3f2b1c4</CodeSnippet>
    </Step>
    
    <Step number={3}>
      <Icon>✅</Icon>
      <H3>Users Join</H3>
      <Description>
        Users click the button, connect their wallet,
        and join automatically if they hold the required tokens.
      </Description>
      <AnimatedFlow />
    </Step>
  </Steps>
</HowItWorksSection>
```

**Design notes**:
- Vertical timeline on desktop
- Cards on mobile
- Animated transitions between steps
- Code snippets with copy button

---

#### Section 4: Features Grid
```tsx
<FeaturesSection>
  <SectionHeader>
    <H2>Powerful Features</H2>
  </SectionHeader>
  
  <FeaturesGrid>
    <FeatureCard>
      <Icon>🔄</Icon>
      <H4>Automated Verification</H4>
      <P>
        Checks token balances every 15 minutes.
        Removes users who no longer hold tokens.
      </P>
    </FeatureCard>
    
    <FeatureCard>
      <Icon>🪙</Icon>
      <H4>Any SPL Token</H4>
      <P>
        Support for all Solana SPL tokens.
        Set custom minimum amounts.
      </P>
    </FeatureCard>
    
    <FeatureCard>
      <Icon>🔒</Icon>
      <H4>Secure Authentication</H4>
      <P>
        Wallet signature verification.
        No private keys, no passwords.
      </P>
    </FeatureCard>
    
    <FeatureCard>
      <Icon>⚡</Icon>
      <H4>Instant Access</H4>
      <P>
        One-click join for holders.
        No manual approvals needed.
      </P>
    </FeatureCard>
    
    <FeatureCard>
      <Icon>📊</Icon>
      <H4>Single-Use Links</H4>
      <P>
        Each join link works once.
        Prevents sharing and abuse.
      </P>
    </FeatureCard>
    
    <FeatureCard>
      <Icon>🌐</Icon>
      <H4>Multi-Wallet Support</H4>
      <P>
        Works with Phantom, Backpack, Solflare,
        and more.
      </P>
    </FeatureCard>
  </FeaturesGrid>
</FeaturesSection>
```

**Design notes**:
- 3 columns on desktop, 2 on tablet, 1 on mobile
- Hover effects (lift, glow)
- Icons with gradient backgrounds
- Consistent card heights

---

#### Section 5: For Admins
```tsx
<AdminGuideSection id="setup">
  <SectionHeader>
    <H2>Admin Setup Guide</H2>
    <Subtitle>Configure your token-gated group in minutes</Subtitle>
  </SectionHeader>
  
  <StepByStepGuide>
    <GuideStep>
      <Number>1</Number>
      <Content>
        <H4>Add Bot to Group</H4>
        <P>Search for @OpenGuardBot in Telegram</P>
        <P>Add it to your group and make it an admin</P>
        <Badge>Required Permissions</Badge>
        <PermissionsList>
          - Invite users via link
          - Ban users
        </PermissionsList>
      </Content>
      <Visual>
        <img src="/images/add-bot.png" alt="Add bot" />
      </Visual>
    </GuideStep>
    
    <GuideStep>
      <Number>2</Number>
      <Content>
        <H4>Configure Requirements</H4>
        <CommandBox>
          <Command>/setup</Command>
          <Description>Opens the setup interface</Description>
        </CommandBox>
        <P>Click "Set Mint Address" and paste your token address</P>
        <P>Click "Set Tokens Amount" and enter minimum required</P>
        <Example>
          Example: 1000 tokens minimum to join
        </Example>
      </Content>
    </GuideStep>
    
    <GuideStep>
      <Number>3</Number>
      <Content>
        <H4>Link Your Channel</H4>
        <P>Copy the nonce from setup message</P>
        <CommandBox>
          <Command>/link YOUR_NONCE</Command>
          <Description>Run this in your target channel</Description>
        </CommandBox>
        <P>Bot will post a join button in the channel</P>
      </Content>
    </GuideStep>
  </StepByStepGuide>
  
  <CTABox>
    <H3>Ready to secure your community?</H3>
    <Button href="https://t.me/OpenGuardBot">
      Start with @OpenGuardBot
    </Button>
  </CTABox>
</AdminGuideSection>
```

**Design notes**:
- Accordion-style on mobile
- Screenshots/GIFs of actual Telegram UI
- Copy-paste command boxes
- Clear visual hierarchy

---

#### Section 6: For Users
```tsx
<UserGuideSection>
  <SectionHeader>
    <H2>How to Join a Token-Gated Group</H2>
  </SectionHeader>
  
  <SimpleSteps>
    <UserStep>
      <Icon>👆</Icon>
      <H4>Click Join Button</H4>
      <P>Find the join button in the Telegram channel</P>
    </UserStep>
    
    <Arrow />
    
    <UserStep>
      <Icon>👛</Icon>
      <H4>Connect Wallet</H4>
      <P>Choose Phantom, Backpack, or Solflare</P>
      <WalletLogos />
    </UserStep>
    
    <Arrow />
    
    <UserStep>
      <Icon>✅</Icon>
      <H4>Automatic Verification</H4>
      <P>We check your token balance and approve you</P>
    </UserStep>
  </SimpleSteps>
  
  <FAQ>
    <H3>Common Questions</H3>
    <Accordion>
      <Item question="What wallets are supported?">
        Phantom, Backpack, and Solflare. More coming soon.
      </Item>
      <Item question="Do I need to keep tokens after joining?">
        Yes! We verify every 15 minutes and remove users
        who no longer meet requirements.
      </Item>
      <Item question="Is it safe to connect my wallet?">
        Absolutely. We only verify your balance. We never
        access your private keys or request transactions.
      </Item>
      <Item question="What if I don't have enough tokens?">
        You'll see an error message showing how many tokens
        you need. Get the tokens and try again.
      </Item>
    </Accordion>
  </FAQ>
</UserGuideSection>
```

---

#### Section 7: Stats/Social Proof (Optional)
```tsx
<StatsSection>
  <StatCard>
    <Number>10,000+</Number>
    <Label>Communities Protected</Label>
  </StatCard>
  
  <StatCard>
    <Number>1M+</Number>
    <Label>Verifications Run</Label>
  </StatCard>
  
  <StatCard>
    <Number>99.9%</Number>
    <Label>Uptime</Label>
  </StatCard>
</StatsSection>
```

---

#### Section 8: Footer
```tsx
<Footer>
  <FooterContent>
    <Brand>
      <Logo />
      <Tagline>Secure Telegram communities with Solana</Tagline>
    </Brand>
    
    <Links>
      <Column>
        <H5>Product</H5>
        <Link href="#how-it-works">How It Works</Link>
        <Link href="#setup">Setup Guide</Link>
        <Link href="#faq">FAQ</Link>
      </Column>
      
      <Column>
        <H5>Resources</H5>
        <Link href="/docs">Documentation</Link>
        <Link href="https://github.com/...">GitHub</Link>
        <Link href="/api">API</Link>
      </Column>
      
      <Column>
        <H5>Community</H5>
        <Link href="https://t.me/...">Telegram</Link>
        <Link href="https://twitter.com/...">Twitter</Link>
        <Link href="https://discord.com/...">Discord</Link>
      </Column>
    </Links>
  </FooterContent>
  
  <Copyright>
    © 2025 OpenGuard. Powered by Solana.
  </Copyright>
</Footer>
```

---

## 🎭 Component Library

Create reusable components in `/components`:

### Layout Components
```tsx
// components/layout/Navigation.tsx
export function Navigation() {
  return (
    <nav className="fixed top-0 w-full bg-bg-dark/80 backdrop-blur-lg z-50">
      <Container>
        <Logo />
        <NavLinks>
          <NavLink href="#how-it-works">How It Works</NavLink>
          <NavLink href="#setup">Setup</NavLink>
          <NavLink href="#faq">FAQ</NavLink>
        </NavLinks>
        <Button variant="primary" href="https://t.me/OpenGuardBot">
          Get Started
        </Button>
      </Container>
    </nav>
  );
}

// components/layout/Container.tsx
export function Container({ children, className }: Props) {
  return (
    <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

// components/layout/Section.tsx
export function Section({ children, className, id }: Props) {
  return (
    <section id={id} className={cn("py-20 lg:py-32", className)}>
      <Container>{children}</Container>
    </section>
  );
}
```

---

### UI Components
```tsx
// components/ui/Button.tsx
export function Button({
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-primary hover:bg-primary-dark",
    secondary: "bg-transparent border-2 border-primary",
    ghost: "bg-transparent hover:bg-white/10",
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };
  
  return (
    <button
      className={cn(
        "rounded-lg font-semibold transition-all",
        variants[variant],
        sizes[size]
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// components/ui/Card.tsx
export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "bg-bg-card rounded-xl p-6 border border-white/10",
        hover && "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all",
        className
      )}
    >
      {children}
    </div>
  );
}

// components/ui/Badge.tsx
export function Badge({ children, variant = "default" }: BadgeProps) {
  const variants = {
    default: "bg-white/10 text-text-primary",
    primary: "bg-primary/20 text-primary-light",
    success: "bg-success/20 text-success",
  };
  
  return (
    <span className={cn("px-3 py-1 rounded-full text-sm font-medium", variants[variant])}>
      {children}
    </span>
  );
}
```

---

### Feature Components
```tsx
// components/features/WalletSelector.tsx
export function WalletSelector({ onSelect }: Props) {
  const wallets = [
    { name: "Phantom", icon: "/icons/phantom.svg" },
    { name: "Backpack", icon: "/icons/backpack.svg" },
    { name: "Solflare", icon: "/icons/solflare.svg" },
  ];
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {wallets.map((wallet) => (
        <button
          key={wallet.name}
          onClick={() => onSelect(wallet.name)}
          className="p-6 bg-bg-card rounded-lg hover:bg-bg-card/80 transition-all"
        >
          <img src={wallet.icon} alt={wallet.name} className="w-12 h-12 mx-auto" />
          <p className="mt-2 text-sm">{wallet.name}</p>
        </button>
      ))}
    </div>
  );
}

// components/features/LoadingSpinner.tsx
export function LoadingSpinner({ size = "md", text }: Props) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full border-4 border-primary/30 border-t-primary h-12 w-12" />
      {text && <p className="text-text-secondary">{text}</p>}
    </div>
  );
}

// components/features/ProgressSteps.tsx
export function ProgressSteps({ currentStep, steps }: Props) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <Step
            number={index + 1}
            label={step}
            active={index === currentStep}
            completed={index < currentStep}
          />
          {index < steps.length - 1 && <Connector />}
        </React.Fragment>
      ))}
    </div>
  );
}
```

---

### Code Snippet Component
```tsx
// components/ui/CodeSnippet.tsx
export function CodeSnippet({ code, language = "bash" }: Props) {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="relative bg-black/50 rounded-lg p-4 font-mono text-sm">
      <code className={`language-${language}`}>{code}</code>
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 p-2 bg-white/10 rounded hover:bg-white/20"
      >
        {copied ? "✓" : "📋"}
      </button>
    </div>
  );
}
```

---

## 🎯 Join Page Enhancement (`app/join/[id]/page.tsx`)

### State Management
```tsx
type JoinState = 
  | { status: "idle" }
  | { status: "connecting"; wallet: WalletType }
  | { status: "authenticating" }
  | { status: "checking-balance" }
  | { status: "creating-link" }
  | { status: "success"; link: string }
  | { status: "error"; error: ErrorType };

const [state, setState] = useState<JoinState>({ status: "idle" });
```

### UI Structure
```tsx
<JoinLayout>
  <Card>
    <Header>
      <Logo />
      <Title>Join Token-Gated Group</Title>
    </Header>
    
    <ProgressSteps
      currentStep={getCurrentStep(state)}
      steps={["Connect Wallet", "Verify Balance", "Join Group"]}
    />
    
    <Content>
      {state.status === "idle" && <WalletSelector onSelect={handleConnect} />}
      {state.status === "connecting" && <LoadingSpinner text="Connecting to wallet..." />}
      {state.status === "authenticating" && <LoadingSpinner text="Signing message..." />}
      {state.status === "checking-balance" && <LoadingSpinner text="Verifying token balance..." />}
      {state.status === "success" && <SuccessView link={state.link} />}
      {state.status === "error" && <ErrorView error={state.error} />}
    </Content>
  </Card>
</JoinLayout>
```

### Error Display
```tsx
function ErrorView({ error }: { error: ErrorType }) {
  const errorMessages = {
    insufficient_funds: {
      title: "Insufficient Tokens",
      message: "You don't have enough tokens to join this group.",
      action: "Get Tokens",
      icon: "💰",
    },
    invalid_portal: {
      title: "Invalid Link",
      message: "This join link is invalid or has expired.",
      action: "Contact Admin",
      icon: "❌",
    },
    wallet_rejected: {
      title: "Wallet Connection Failed",
      message: "You rejected the wallet connection request.",
      action: "Try Again",
      icon: "🔌",
    },
  };
  
  const errorInfo = errorMessages[error.type];
  
  return (
    <div className="text-center">
      <div className="text-6xl mb-4">{errorInfo.icon}</div>
      <h2 className="text-2xl font-bold mb-2">{errorInfo.title}</h2>
      <p className="text-text-secondary mb-6">{errorInfo.message}</p>
      {error.details && (
        <CodeSnippet code={JSON.stringify(error.details, null, 2)} />
      )}
      <Button onClick={handleRetry}>{errorInfo.action}</Button>
    </div>
  );
}
```

---

## 🚀 Implementation Priority

### Phase 1: Foundation (Week 1)
- [ ] Set up component structure
- [ ] Create design system (colors, typography)
- [ ] Build layout components (Navigation, Footer, Container)
- [ ] Build UI primitives (Button, Card, Badge)

### Phase 2: Landing Page (Week 2)
- [ ] Hero section with animations
- [ ] How It Works section
- [ ] Features grid
- [ ] Admin guide section
- [ ] Footer

### Phase 3: Join Page (Week 3)
- [ ] State management
- [ ] Wallet selector UI
- [ ] Loading states
- [ ] Error handling UI
- [ ] Success screen

### Phase 4: Polish (Week 4)
- [ ] Animations and transitions
- [ ] Mobile responsiveness
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] SEO (metadata, OG images)

---

## 🎨 Animation Ideas

### Hero Section
```tsx
// Floating tokens animation
<motion.div
  animate={{
    y: [0, -20, 0],
    rotate: [0, 5, -5, 0],
  }}
  transition={{
    duration: 5,
    repeat: Infinity,
    ease: "easeInOut",
  }}
>
  <TokenIcon />
</motion.div>
```

### Feature Cards
```tsx
// Hover lift effect
<motion.div
  whileHover={{ y: -8, scale: 1.02 }}
  transition={{ duration: 0.2 }}
>
  <FeatureCard />
</motion.div>
```

### Join Flow
```tsx
// Step progression animation
<motion.div
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: -20 }}
  transition={{ duration: 0.3 }}
>
  <StepContent />
</motion.div>
```

---

## 📱 Responsive Breakpoints

```tsx
// tailwind.config.js
theme: {
  screens: {
    'sm': '640px',   // Mobile landscape
    'md': '768px',   // Tablet
    'lg': '1024px',  // Desktop
    'xl': '1280px',  // Large desktop
    '2xl': '1536px', // Extra large
  }
}
```

### Mobile-First Approach
```tsx
<div className="
  flex flex-col          // Mobile: stack
  md:flex-row            // Tablet+: side-by-side
  gap-4 md:gap-8         // Responsive spacing
  px-4 md:px-8 lg:px-16  // Responsive padding
">
  {/* Content */}
</div>
```

---

## 🔧 Utilities

### Class Name Utility
```tsx
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Copy to Clipboard
```tsx
// hooks/useCopyToClipboard.ts
export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);
  
  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return { copied, copy };
}
```

---

## ✅ Checklist

### Before Starting
- [ ] Read DEVELOPMENT_GUIDE.md
- [ ] Read ARCHITECTURE.md
- [ ] Understand what NOT to touch

### Landing Page
- [ ] Hero section
- [ ] Problem/Solution
- [ ] How It Works
- [ ] Features
- [ ] Admin Guide
- [ ] User Guide
- [ ] Footer

### Join Page
- [ ] Wallet selector
- [ ] Loading states
- [ ] Error handling
- [ ] Success state
- [ ] Mobile responsive

### Polish
- [ ] Animations
- [ ] Dark mode (primary)
- [ ] Accessibility
- [ ] Performance
- [ ] SEO

---

**Ready to build!** Start with the landing page hero section and work your way down. Focus on making it beautiful, modern, and user-friendly. The backend is solid—make the frontend shine! ✨


