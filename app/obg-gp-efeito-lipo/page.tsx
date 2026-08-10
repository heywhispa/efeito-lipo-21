import type { Metadata } from 'next'
import { GrupoCta, ObgPageview } from './_cta'

export const metadata: Metadata = {
  title: 'Compra confirmada — Efeito Lipo 21',
  description:
    'Bem-vinda ao Efeito Lipo! Falta só entrar no grupo pra receber seus acessos e o passo a passo de cada dia do desafio.',
  // Página de pós-compra: não deve aparecer no Google.
  robots: { index: false, follow: false },
}

// CSS da página. Tudo escopado em `.obg` — inclusive o que seria do <body> no
// HTML original — porque aqui o body pertence ao layout do site inteiro.
// As cores e fontes saem dos tokens da marca (globals.css + layout.tsx).
const CSS = `
.obg{
  --obg-wa:#1FAD54;
  --obg-wa-deep:#178A43;
  --obg-line:#E6E2DC;

  min-height:100dvh;
  background:
    radial-gradient(120% 70% at 50% -10%, rgba(28,135,60,.10), transparent 62%),
    var(--pale);
  color:var(--ink);
  font-family:var(--font-body);
  line-height:1.55;
  padding:0 20px 44px;
}
.obg *{margin:0;padding:0;box-sizing:border-box}
.obg .wrap{max-width:520px;margin:0 auto}

/* ---------- TOPO: confirmação ---------- */
.obg .top{text-align:center;padding:44px 0 0;animation:obg-fade .6s var(--ease-out) both}

.obg .seal{
  width:76px;height:76px;margin:0 auto;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  background:linear-gradient(150deg,var(--g),var(--gd));
  box-shadow:0 12px 30px rgba(28,135,60,.32), inset 0 0 0 4px rgba(255,255,255,.18);
  color:#fff;
}
.obg .seal svg{width:38px;height:38px;stroke-dasharray:40;
  animation:obg-check .55s var(--ease-out) .18s both}

.obg .badge{
  display:inline-flex;align-items:center;gap:7px;margin-top:18px;
  background:rgba(28,135,60,.10);color:var(--g);
  border:1px solid rgba(28,135,60,.22);border-radius:999px;
  padding:7px 15px;font-size:12px;font-weight:700;
  letter-spacing:.16em;text-transform:uppercase;
}
.obg .badge i{width:7px;height:7px;border-radius:50%;background:var(--g);font-style:normal}

.obg h1{
  font-family:var(--font-display);font-weight:800;
  font-size:clamp(27px,7.4vw,36px);line-height:1.1;letter-spacing:-.02em;
  margin:16px auto 0;max-width:16ch;
}
/* "Efeito Lipo" é o nome do produto: nunca quebra no meio. */
.obg h1 em{font-style:normal;color:var(--g);white-space:nowrap}
.obg .sub{margin:14px auto 0;max-width:34ch;font-size:16px;color:var(--sub)}
.obg .sub strong{color:var(--ink);font-weight:600}

/* ---------- CARD: próximo passo ---------- */
.obg .card{
  background:var(--wh);border:1px solid var(--obg-line);border-radius:20px;
  padding:26px 22px 24px;margin-top:28px;text-align:center;
  box-shadow:0 14px 34px rgba(0,0,0,.06);
  animation:obg-fade .6s var(--ease-out) .1s both;
}
.obg .step{
  font-size:11.5px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;
  color:var(--o);
}
.obg .card h2{
  font-family:var(--font-display);font-weight:800;
  font-size:clamp(21px,5.6vw,26px);line-height:1.18;letter-spacing:-.015em;
  margin:10px auto 0;max-width:18ch;
}
.obg .card p{margin:12px auto 0;max-width:36ch;font-size:15px;color:var(--sub)}
.obg .card p b{color:var(--ink);font-weight:700}

/* ---------- CTA ---------- */
.obg .cta{
  display:flex;align-items:center;justify-content:center;gap:11px;
  background:var(--obg-wa);color:#fff;text-decoration:none;
  font-weight:700;font-size:17px;letter-spacing:.01em;
  padding:18px 22px;border-radius:999px;
  box-shadow:0 10px 26px rgba(31,173,84,.34);
  transition:transform .15s ease, box-shadow .15s ease, background .15s ease;
  width:100%;max-width:400px;margin:20px auto 0;
}
.obg .cta:hover{background:var(--obg-wa-deep);transform:translateY(-2px);box-shadow:0 14px 30px rgba(31,173,84,.44)}
.obg .cta:active{transform:translateY(0)}
.obg .cta svg{width:24px;height:24px;flex:none}
.obg .cta-note{margin-top:11px;font-size:12.5px;color:var(--mute)}

/* ---------- O QUE TEM NO GRUPO ---------- */
.obg .list{display:grid;gap:10px;margin-top:20px;text-align:left}
.obg .item{
  display:flex;gap:13px;align-items:center;
  background:var(--pale);border:1px solid var(--obg-line);border-radius:14px;
  padding:13px 15px;
}
.obg .item .ico{
  flex:none;width:40px;height:40px;border-radius:12px;
  display:flex;align-items:center;justify-content:center;
  background:var(--wh);border:1px solid var(--obg-line);font-size:19px;line-height:1;
}
.obg .item span{font-size:14.5px;color:var(--ink);line-height:1.4}
.obg .item b{font-weight:700}

/* ---------- RODAPÉ ---------- */
.obg .mail{
  margin-top:22px;text-align:center;font-size:14px;color:var(--sub);
  border-top:1px solid var(--obg-line);padding-top:20px;
  animation:obg-fade .6s var(--ease-out) .2s both;
}
.obg .mail b{color:var(--ink);font-weight:600}

@keyframes obg-fade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes obg-check{from{stroke-dashoffset:40}to{stroke-dashoffset:0}}
@media (prefers-reduced-motion:reduce){.obg *{animation:none!important;transition:none!important}}
`

export default function Page() {
  return (
    <div className="obg">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <ObgPageview />

      <div className="wrap">
        {/* ━━ CONFIRMAÇÃO ━━ */}
        <section className="top">
          <div className="seal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M4 12.5l5.2 5.2L20 7" />
            </svg>
          </div>

          <div className="badge"><i />Compra confirmada</div>

          <h1>Bem-vinda ao <em>Efeito Lipo</em>, musa! 💚</h1>

          <p className="sub">
            Você deu o primeiro passo pra secar a barriga e definir os braços.{' '}
            <strong>Agora falta só uma coisa</strong> pra começar do jeito certo 👇
          </p>
        </section>

        {/* ━━ PRÓXIMO PASSO ━━ */}
        <section className="card">
          <div className="step">Seu próximo passo</div>
          <h2>Entrar no grupo agora</h2>
          <p>
            É no grupo que a Laura te guia todo dia, solta o passo a passo e você
            recebe seus acessos. <b>Não comece sem entrar!</b>
          </p>

          <GrupoCta label="card">Entrar no grupo agora</GrupoCta>
          <div className="cta-note">Leva 10 segundos · grupo oficial do desafio</div>

          <div className="list">
            <div className="item">
              <div className="ico" aria-hidden>📲</div>
              <span>O <b>passo a passo</b> de cada dia do desafio</span>
            </div>
            <div className="item">
              <div className="ico" aria-hidden>🔑</div>
              <span>Seus <b>acessos</b> e as aulas de introdução</span>
            </div>
            <div className="item">
              <div className="ico" aria-hidden>🔥</div>
              <span>Dicas e <b>motivação diária</b> da Laura</span>
            </div>
          </div>
        </section>

        {/* ━━ E-MAIL ━━ */}
        <p className="mail">
          Seu <b>acesso completo</b> também chegou no seu e-mail 💌
        </p>
      </div>
    </div>
  )
}
