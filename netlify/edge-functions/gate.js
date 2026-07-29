const TARGET_TIME = new Date("2026-07-29T17:40:00+05:30").getTime();

export default async (request, context) => {
  const now = Date.now();

  if (now < TARGET_TIME) {
    return new Response(COUNTDOWN_HTML, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store, no-cache, must-revalidate",
        "x-robots-tag": "noindex, nofollow",
      },
    });
  }

  return context.next();
};

export const config = { path: "/*" };

const COUNTDOWN_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="robots" content="noindex, nofollow" />
<title>Something Beautiful Is Coming</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Manrope:wght@300;400;500;700&display=swap" rel="stylesheet">
<style>
  :root{
    --void:#0a0908;
    --gold:#c9a86a;
    --gold-bright:#f0dfb0;
    --ivory:#f4ede1;
    --ivory-dim:rgba(244,237,225,0.6);
  }
  *{margin:0;padding:0;box-sizing:border-box;}
  html,body{height:100%;}
  body{
    min-height:100vh;
    display:flex;
    align-items:center;
    justify-content:center;
    background:
      radial-gradient(120% 90% at 50% 100%, rgba(201,168,106,0.10) 0%, rgba(0,0,0,0) 55%),
      radial-gradient(120% 90% at 50% 0%, rgba(201,168,106,0.06) 0%, rgba(0,0,0,0) 45%),
      var(--void);
    font-family:'Manrope', sans-serif;
    color:var(--ivory);
    text-align:center;
    overflow:hidden;
    position:relative;
    padding:24px;
  }
  .grain{
    position:absolute;inset:0;
    opacity:0.04;
    pointer-events:none;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    mix-blend-mode:overlay;
  }
  .wrap{ position:relative; z-index:2; max-width:640px; }
  .mark{
    font-family:'Cormorant Garamond', serif;
    font-style:italic;
    font-size:clamp(1.2rem, 4vw, 1.6rem);
    letter-spacing:0.3em;
    padding-left:0.3em;
    color:var(--gold-bright);
    opacity:0.9;
    margin-bottom:28px;
  }
  .eyebrow{
    font-size:0.68rem;
    letter-spacing:0.4em;
    text-transform:uppercase;
    color:var(--gold);
    font-weight:700;
    margin-bottom:20px;
  }
  h1{
    font-family:'Cormorant Garamond', serif;
    font-style:italic;
    font-weight:500;
    font-size:clamp(2.2rem, 7vw, 3.8rem);
    line-height:1.08;
    letter-spacing:0.01em;
    margin-bottom:16px;
    color:var(--ivory);
  }
  h1 span{
    display:block;
    background:linear-gradient(180deg, var(--gold-bright) 0%, var(--gold) 100%);
    -webkit-background-clip:text;
    background-clip:text;
    -webkit-text-fill-color:transparent;
  }
  .sub{
    font-size:0.95rem;
    color:var(--ivory-dim);
    letter-spacing:0.02em;
    margin-bottom:48px;
  }
  .timer{
    display:flex;
    gap:14px;
    justify-content:center;
    flex-wrap:wrap;
  }
  .unit{
    background:rgba(244,237,225,0.04);
    border:1px solid rgba(244,237,225,0.12);
    border-radius:14px;
    padding:18px 20px;
    min-width:78px;
    backdrop-filter:blur(6px);
  }
  .num{
    display:block;
    font-family:'Cormorant Garamond', serif;
    font-size:2.1rem;
    color:var(--ivory);
    letter-spacing:0.02em;
  }
  .label{
    display:block;
    font-size:0.62rem;
    text-transform:uppercase;
    letter-spacing:0.2em;
    color:var(--gold);
    margin-top:6px;
    font-weight:700;
  }
  .footer-line{
    width:1px;height:0;
    background:var(--gold);
    margin:44px auto 20px;
    animation:growLine 1s ease forwards;
    animation-delay:0.4s;
  }
  @keyframes growLine{ to{height:36px;} }
  .footer{
    font-size:0.66rem;
    letter-spacing:0.25em;
    text-transform:uppercase;
    color:var(--ivory-dim);
  }
  @media (max-width:420px){
    .unit{ min-width:64px; padding:14px 12px; }
    .num{ font-size:1.6rem; }
  }
  .device-notice{
    display:none;
    margin-top:22px;
    font-size:0.62rem;
    letter-spacing:0.08em;
    color:var(--ivory-dim);
    opacity:0.75;
  }
  .device-notice.is-shown{ display:block; }
  .block-screen{
    position:fixed; inset:0; z-index:10;
    display:flex; align-items:center; justify-content:center;
    background:var(--void);
    padding:32px;
  }
  .block-screen p{
    max-width:420px;
    font-family:'Cormorant Garamond', serif;
    font-size:1.05rem;
    line-height:1.7;
    color:var(--ivory);
    text-align:center;
    opacity:0.92;
  }
</style>
</head>
<body>
  <div class="grain"></div>
  <div class="wrap">
    <div class="mark">P &#10022; J</div>
    <div class="eyebrow">A Story, Waiting To Be Opened</div>
    <h1>Something Beautiful<span>Is On Its Way.</span></h1>
    <p class="sub">Come back soon — it opens the moment the countdown ends.</p>
    <div class="timer" id="timer">
      <div class="unit"><span class="num" id="d">--</span><span class="label">Days</span></div>
      <div class="unit"><span class="num" id="h">--</span><span class="label">Hours</span></div>
      <div class="unit"><span class="num" id="m">--</span><span class="label">Minutes</span></div>
      <div class="unit"><span class="num" id="s">--</span><span class="label">Seconds</span></div>
    </div>
    <p class="device-notice" id="device-notice">Please use android operating system smartphone to access this website.</p>
    <div class="footer-line"></div>
    <div class="footer">Come back soon</div>
  </div>
<script>
  function isAllowedDevice() {
    var ua = navigator.userAgent || '';
    var isAndroidUA = /android/i.test(ua);
    var coarse = false, noHover = false;
    try {
      coarse = window.matchMedia('(pointer: coarse)').matches;
      noHover = window.matchMedia('(hover: none)').matches;
    } catch (e) {}
    var hasTouch = (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) || ('ontouchstart' in window);
    return isAndroidUA || (coarse && noHover && hasTouch);
  }

  function showBlockScreen() {
    try { window.stop(); } catch (e) {}
    document.body.innerHTML =
      '<div class="block-screen"><p>Please use android operating system smartphone to access this website.</p></div>';
  }

  var allowed = isAllowedDevice();
  if (!allowed) {
    var notice = document.getElementById('device-notice');
    if (notice) notice.classList.add('is-shown');
  } else {
    try {
      var vp = document.querySelector('meta[name="viewport"]');
      var fakeDesktopViewport = window.innerWidth > (window.screen.width * 1.35);
      if (vp && fakeDesktopViewport) {
        vp.setAttribute('content', 'width=' + window.screen.width + ', initial-scale=1.0');
      }
    } catch (e) {}
  }

  var target = new Date("2026-07-29T17:40:00+05:30").getTime();
  function tick() {
    var diff = target - Date.now();
    if (diff <= 0) {
      if (!allowed) {
        showBlockScreen();
      } else {
        window.location.reload();
      }
      return;
    }
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    document.getElementById('d').textContent = d;
    document.getElementById('h').textContent = String(h).padStart(2, '0');
    document.getElementById('m').textContent = String(m).padStart(2, '0');
    document.getElementById('s').textContent = String(s).padStart(2, '0');
  }
  tick();
  setInterval(tick, 1000);

  window.addEventListener('resize', function () {
    if (allowed && !isAllowedDevice()) { allowed = false; showBlockScreen(); }
  });
</script>
</body>
</html>`;
