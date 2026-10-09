const roles = {
  guest:    { icon:'👤', name:'访客',       title:'公共首页',   desc:'浏览工具与基础计算', stats:[['8','可用工具'],['4','计算器'],['120+','学习文章']] },
  student:  { icon:'🎓', name:'学生',       title:'学习中心',   desc:'为金融专业学生打造的学习与练习空间', stats:[['12','学习模块'],['45','公式'],['8','练习题']] },
  investor: { icon:'📈', name:'个人投资者', title:'投资工作台', desc:'定投、复利、组合分析与市场看板', stats:[['6','分析工具'],['3','组合'],['12','计算历史']] },
  pro:      { icon:'💼', name:'金融从业者', title:'专业终端',   desc:'债券、期权、DCF 与风险指标专业计算', stats:[['10','专业工具'],['CSV','数据导出'],['批量','计算']] }
};

const wsCards = {
  guest: [
    { icon:'💰', title:'复利计算器', desc:'快速体验复利的力量', calc:'compound' },
    { icon:'🏠', title:'房贷计算器', desc:'等额本息 / 等额本金对比', calc:'loan' },
    { icon:'📚', title:'金融知识库', desc:'注册后可解锁完整学习中心', action:'alert' },
    { icon:'👤', title:'注册账号', desc:'保存你的计算历史与组合', action:'alert' }
  ],
  student: [
    { icon:'💰', title:'复利练习', desc:'货币时间价值基础练习', calc:'compound' },
    { icon:'📊', title:'定投计算', desc:'理解平均成本法', calc:'dca' },
    { icon:'📜', title:'债券定价', desc:'久期与凸性入门', calc:'bond' },
    { icon:'📐', title:'公式库', desc:'45 个核心公式速查', action:'alert' },
    { icon:'📝', title:'每日一题', desc:'巩固金融计算能力', action:'alert' },
    { icon:'🗺️', title:'学习路线', desc:'从基础到衍生品', action:'alert' }
  ],
  investor: [
    { icon:'💰', title:'复利规划', desc:'测算长期财富增长', calc:'compound' },
    { icon:'📊', title:'定投计算', desc:'每月投入收益测算', calc:'dca' },
    { icon:'🏠', title:'房贷计算', desc:'还款方式对比', calc:'loan' },
    { icon:'📈', title:'组合分析', desc:'资产配置与风险指标', action:'alert' },
    { icon:'🌐', title:'市场看板', desc:'指数与行业涨跌', action:'scroll' },
    { icon:'🕘', title:'计算历史', desc:'保存与管理历史记录', action:'alert' }
  ],
  pro: [
    { icon:'📜', title:'债券定价', desc:'价格、久期、凸性', calc:'bond' },
    { icon:'📉', title:'期权盈亏', desc:'到期盈亏图', action:'alert' },
    { icon:'🏢', title:'DCF 估值', desc:'企业价值估算', action:'alert' },
    { icon:'⚠️', title:'风险指标', desc:'夏普、回撤、波动率', action:'alert' },
    { icon:'📤', title:'数据导出', desc:'批量计算与 CSV 导出', action:'alert' },
    { icon:'💰', title:'复利计算', desc:'专业参数设置', calc:'compound' }
  ]
};

let currentRole = localStorage.getItem('fincalc_role') || 'guest';

function setRole(role) {
  if (!roles[role]) role = 'guest';
  currentRole = role;
  localStorage.setItem('fincalc_role', role);
  const r = roles[role];
  document.getElementById('currentRoleIcon').textContent = r.icon;
  document.getElementById('currentRoleName').textContent = r.name;
  document.querySelectorAll('.role-option').forEach(o => {
    o.classList.toggle('active', o.dataset.role === role);
  });
  document.getElementById('wsAvatar').textContent = r.icon;
  document.getElementById('wsTitle').textContent = r.title;
  document.getElementById('wsDesc').textContent = r.desc;
  document.getElementById('wsStats').innerHTML = r.stats.map(s =>
    `<div class="ws-stat"><div class="n">${s[0]}</div><div class="l">${s[1]}</div></div>`
  ).join('');
  document.getElementById('wsGrid').innerHTML = wsCards[role].map(c => `
    <div class="ws-card">
      <div class="wc-icon">${c.icon}</div>
      <div class="wc-title">${c.title}</div>
      <div class="wc-desc">${c.desc}</div>
      <button class="wc-btn" onclick="handleWsAction('${c.calc || ''}','${c.action || ''}')">进入</button>
    </div>
  `).join('');
  if (role === 'guest') {
    goPage('home');
  } else {
    goPage('workspace');
  }
}

function handleWsAction(calc, action) {
  if (calc) goCalc(calc);
  else if (action === 'scroll') {
    goPage('home');
    setTimeout(() => document.getElementById('data').scrollIntoView({behavior:'smooth'}), 100);
  } else {
    alert('该功能为演示占位，可在此扩展。');
  }
}

function goPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(id);
  if (page) page.classList.add('active');
  window.scrollTo(0, 0);
  document.querySelectorAll('.nav-menu a').forEach(a => {
    a.classList.toggle('active', a.dataset.nav === id);
  });
}

function scrollToSection(id) {
  goPage('home');
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({behavior:'smooth'});
  }, 100);
}

let slideIndex = 0;
let slideTimer = null;

function initCarousel() {
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.getElementById('heroDots');
  if (!slides.length || !dotsContainer) return;
  dotsContainer.innerHTML = '';
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goSlide(i));
    dotsContainer.appendChild(dot);
  });
  startSlideTimer();
}

function goSlide(i) {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.hero-dots .dot');
  if (!slides.length) return;
  slides[slideIndex].classList.remove('active');
  dots[slideIndex].classList.remove('active');
  slideIndex = (i + slides.length) % slides.length;
  slides[slideIndex].classList.add('active');
  dots[slideIndex].classList.add('active');
}

function startSlideTimer() {
  if (slideTimer) clearInterval(slideTimer);
  slideTimer = setInterval(() => goSlide(slideIndex + 1), 5000);
}

const indices = [
  { name:'上证指数', value:'3,245.67', change:'+0.82%', up:true },
  { name:'深证成指', value:'10,876.34', change:'+1.15%', up:true },
  { name:'创业板指', value:'2,145.89', change:'-0.43%', up:false },
  { name:'恒生指数', value:'18,234.12', change:'+0.67%', up:true },
  { name:'纳斯达克', value:'16,789.45', change:'+1.23%', up:true },
  { name:'标普500', value:'5,234.56', change:'-0.21%', up:false }
];

function renderIndices() {
  const ticker = document.getElementById('tickerBar');
  const grid = document.getElementById('indexGrid');
  if (ticker) {
    ticker.innerHTML = indices.map(i =>
      `<div class="ticker-item"><span class="t-name">${i.name}</span><span class="${i.up?'t-up':'t-down'}">${i.value} ${i.change}</span></div>`
    ).join('');
  }
  if (grid) {
    grid.innerHTML = indices.map(i => `
      <div class="index-card">
        <div class="index-name">${i.name}</div>
        <div class="index-value">${i.value}</div>
        <div class="index-change ${i.up?'up':'down'}">${i.change}</div>
      </div>
    `).join('');
  }
}

function drawLineChart() {
  const canvas = document.getElementById('lineChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth || 600;
  const H = canvas.height = 220;
  const data = [100, 108, 105, 118, 125, 122, 135, 142, 138, 150, 158, 165];
  const pad = 30;
  const max = Math.max(...data) * 1.1;
  const min = Math.min(...data) * 0.9;
  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = '#243049'; ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad + (H - pad*2) * i / 4;
    ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y); ctx.stroke();
  }
  const stepX = (W - pad*2) / (data.length - 1);
  ctx.beginPath();
  data.forEach((v, i) => {
    const x = pad + stepX * i;
    const y = H - pad - (H - pad*2) * (v - min) / (max - min);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.strokeStyle = '#f5b942'; ctx.lineWidth = 2.5; ctx.stroke();
  ctx.lineTo(W - pad, H - pad); ctx.lineTo(pad, H - pad); ctx.closePath();
  const grad = ctx.createLinearGradient(0, pad, 0, H - pad);
  grad.addColorStop(0, 'rgba(245,185,66,0.3)');
  grad.addColorStop(1, 'rgba(245,185,66,0)');
  ctx.fillStyle = grad; ctx.fill();
  data.forEach((v, i) => {
    const x = pad + stepX * i;
    const y = H - pad - (H - pad*2) * (v - min) / (max - min);
    ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI*2);
    ctx.fillStyle = '#f5b942'; ctx.fill();
  });
}

function drawBarChart() {
  const canvas = document.getElementById('barChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth || 400;
  const H = canvas.height = 220;
  const data = [
    { name:'科技', v: 2.3 }, { name:'金融', v: 1.1 },
    { name:'消费', v: -0.8 }, { name:'医药', v: 0.5 },
    { name:'能源', v: -1.4 }, { name:'地产', v: 0.9 }
  ];
  const pad = 30;
  const max = 3;
  ctx.clearRect(0, 0, W, H);
  const gap = (W - pad*2) / data.length;
  const barW = gap * 0.6;
  data.forEach((d, i) => {
    const x = pad + gap * i + gap * 0.2;
    const barH = Math.abs(d.v) / max * (H - pad*2);
    const y = d.v >= 0 ? H - pad - barH : H - pad;
    ctx.fillStyle = d.v >= 0 ? '#ff4d5e' : '#22c77a';
    ctx.fillRect(x, y, barW, barH);
    ctx.fillStyle = '#8fa3c8'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(d.name, x + barW/2, H - 10);
    ctx.fillStyle = d.v >= 0 ? '#ff4d5e' : '#22c77a';
    ctx.fillText(d.v + '%', x + barW/2, y - 5);
  });
}

/* ============ 折线图辅助：数值缩写 ============ */
function formatShort(v) {
  if (v >= 1e8) return (v/1e8).toFixed(1) + '亿';
  if (v >= 1e4) return (v/1e4).toFixed(1) + '万';
  return Math.round(v).toString();
}

/* ============ 计算器结果折线图 ============ */
function drawResultChart(canvasId, series) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth || 500;
  const H = canvas.height = 200;
  const pad = { l: 50, r: 20, t: 20, b: 28 };
  const allVals = series.flatMap(s => s.data);
  const max = Math.max(...allVals) * 1.08;
  const min = 0;
  ctx.clearRect(0, 0, W, H);

  ctx.strokeStyle = '#243049'; ctx.lineWidth = 1;
  ctx.fillStyle = '#8fa3c8'; ctx.font = '10px sans-serif'; ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const y = pad.t + (H - pad.t - pad.b) * i / 4;
    ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y); ctx.stroke();
    const val = max - (max - min) * i / 4;
    ctx.fillText(formatShort(val), pad.l - 6, y + 3);
  }

  const colors = ['#f5b942', '#2ee6d6', '#3b82f6', '#ff4d5e'];

  series.forEach((s, si) => {
    const stepX = (W - pad.l - pad.r) / Math.max(s.data.length - 1, 1);
    ctx.beginPath();
    s.data.forEach((v, i) => {
      const x = pad.l + stepX * i;
      const y = H - pad.b - (H - pad.t - pad.b) * (v - min) / (max - min);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = colors[si % colors.length];
    ctx.lineWidth = 2.2;
    ctx.stroke();

    if (si === 0) {
      ctx.lineTo(pad.l + stepX * (s.data.length - 1), H - pad.b);
      ctx.lineTo(pad.l, H - pad.b);
      ctx.closePath();
      const g = ctx.createLinearGradient(0, pad.t, 0, H - pad.b);
      g.addColorStop(0, 'rgba(245,185,66,0.25)');
      g.addColorStop(1, 'rgba(245,185,66,0)');
      ctx.fillStyle = g;
      ctx.fill();
    }
  });

  let lx = pad.l;
  series.forEach((s, si) => {
    ctx.fillStyle = colors[si % colors.length];
    ctx.fillRect(lx, 4, 10, 3);
    ctx.fillStyle = '#8fa3c8';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(s.name, lx + 14, 8);
    lx += ctx.measureText(s.name).width + 32;
  });
}

/* ============ 计算历史 ============ */
const HISTORY_KEY = 'fincalc_history';
const HISTORY_MAX = 5;

function saveHistory(entry) {
  try {
    let list = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    list.unshift({ ...entry, time: Date.now() });
    list = list.slice(0, HISTORY_MAX);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  } catch (e) {}
}

function renderHistory() {
  const el = document.getElementById('calcHistory');
  if (!el) return;
  let list = [];
  try { list = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch (e) {}
  if (!list.length) { el.innerHTML = ''; return; }
  el.innerHTML = `
    <div class="history-box">
      <div class="history-head">
        <span>🕘 最近计算</span>
        <button class="history-clear" onclick="clearHistory()">清空</button>
      </div>
      <div class="history-list">
        ${list.map(h => `
          <div class="history-item" onclick="goCalc('${h.type}')">
            <span class="hi-title">${h.title}</span>
            <span class="hi-summary">${h.summary}</span>
            <span class="hi-time">${new Date(h.time).toLocaleString('zh-CN', {month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'})}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function clearHistory() {
  if (!confirm('确定清空所有计算历史吗？')) return;
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
}

/* ============ 计算器配置 ============ */
const calcConfig = {
  compound: {
    title: '复利计算器',
    sub: '计算复利终值，查看利息增长曲线与逐年明细。',
    form: `
      <div class="form-group"><label>初始本金（元）</label><input type="number" id="c_pv" value="100000" /></div>
      <div class="form-group"><label>年利率（%）</label><input type="number" id="c_r" value="8" step="0.1" /></div>
      <div class="form-group"><label>投资年限（年）</label><input type="number" id="c_t" value="10" /></div>
      <div class="form-group"><label>复利频率</label>
        <select id="c_n">
          <option value="1">每年</option>
          <option value="2">每半年</option>
          <option value="4">每季度</option>
          <option value="12" selected>每月</option>
          <option value="365">每日</option>
        </select>
      </div>
      <button class="calc-btn" onclick="calcCompound()">计算终值</button>
    `,
    run: calcCompound
  },
  loan: {
    title: '房贷计算器',
    sub: '对比等额本息与等额本金，查看月供、总利息与还款计划。',
    form: `
      <div class="form-group"><label>贷款金额（元）</label><input type="number" id="l_p" value="1000000" /></div>
      <div class="form-group"><label>年利率（%）</label><input type="number" id="l_r" value="4.2" step="0.01" /></div>
      <div class="form-group"><label>贷款年限（年）</label><input type="number" id="l_t" value="30" /></div>
      <div class="form-group"><label>还款方式</label>
        <select id="l_type">
          <option value="equal">等额本息</option>
          <option value="principal">等额本金</option>
        </select>
      </div>
      <button class="calc-btn" onclick="calcLoan()">计算月供</button>
    `,
    run: calcLoan
  },
  dca: {
    title: '定投计算器',
    sub: '每月定投，测算终值、投入本金与收益。',
    form: `
      <div class="form-group"><label>每月投入（元）</label><input type="number" id="d_pmt" value="3000" /></div>
      <div class="form-group"><label>预期年化收益（%）</label><input type="number" id="d_r" value="8" step="0.1" /></div>
      <div class="form-group"><label>定投年限（年）</label><input type="number" id="d_t" value="10" /></div>
      <button class="calc-btn" onclick="calcDCA()">计算收益</button>
    `,
    run: calcDCA
  },
  bond: {
    title: '债券定价计算器',
    sub: '根据票息、到期收益率与期限，计算债券价格、久期与凸性。',
    form: `
      <div class="form-group"><label>面值（元）</label><input type="number" id="b_f" value="1000" /></div>
      <div class="form-group"><label>票息率（%）</label><input type="number" id="b_c" value="5" step="0.01" /></div>
      <div class="form-group"><label>到期收益率（%）</label><input type="number" id="b_y" value="4" step="0.01" /></div>
      <div class="form-group"><label>剩余期限（年）</label><input type="number" id="b_t" value="5" /></div>
      <div class="form-group"><label>付息频率</label>
        <select id="b_n"><option value="1">每年</option><option value="2">每半年</option></select>
      </div>
      <button class="calc-btn" onclick="calcBond()">计算价格</button>
    `,
    run: calcBond
  }
};

function goCalc(key) {
  const cfg = calcConfig[key];
  if (!cfg) { alert('该计算器开发中'); return; }
  document.getElementById('calcTitle').textContent = cfg.title;
  document.getElementById('calcSub').textContent = cfg.sub;
  document.getElementById('calcForm').innerHTML = cfg.form;
  document.getElementById('calcResult').innerHTML = '<p style="color:var(--text2);font-size:14px;">填写左侧参数后点击计算，结果将显示在这里。</p>';
  goPage('calc');
  setTimeout(() => cfg.run(), 50);
  setTimeout(renderHistory, 60);
}

/* ============ 各计算器 ============ */
function calcCompound() {
  const pv = +document.getElementById('c_pv').value;
  const r = +document.getElementById('c_r').value / 100;
  const t = +document.getElementById('c_t').value;
  const n = +document.getElementById('c_n').value;
  const fv = pv * Math.pow(1 + r/n, n*t);
  const interest = fv - pv;
  let rows = '';
  const chartData = [pv];
  for (let y = 1; y <= t; y++) {
    const v = pv * Math.pow(1 + r/n, n*y);
    chartData.push(v);
    rows += `<tr><td>第 ${y} 年</td><td>${v.toFixed(2)}</td><td>${(v-pv).toFixed(2)}</td></tr>`;
  }
  document.getElementById('calcResult').innerHTML = `
    <div class="result-cards">
      <div class="result-card"><div class="rc-label">期末终值</div><div class="rc-value">¥${fv.toFixed(2)}</div></div>
      <div class="result-card"><div class="rc-label">利息总额</div><div class="rc-value">¥${interest.toFixed(2)}</div></div>
      <div class="result-card"><div class="rc-label">本金翻倍</div><div class="rc-value">${(fv/pv).toFixed(2)} 倍</div></div>
    </div>
    <div class="result-chart-box">
      <h3 style="font-size:14px;margin-bottom:10px;">资产增长曲线</h3>
      <canvas id="resultChartCompound" height="200"></canvas>
    </div>
    <h3 style="font-size:14px;margin:14px 0 10px;">逐年明细</h3>
    <table class="result-table">
      <thead><tr><th>年份</th><th>终值</th><th>累计利息</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div id="calcHistory"></div>
  `;
  drawResultChart('resultChartCompound', [{ name: '资产总额', data: chartData }]);
  saveHistory({
    type: 'compound',
    title: '复利 · ¥' + pv.toLocaleString(),
    summary: `年利率 ${(+document.getElementById('c_r').value).toFixed(1)}% · ${t} 年 → ¥${fv.toFixed(0)}`
  });
  renderHistory();
}

function calcLoan() {
  const P = +document.getElementById('l_p').value;
  const r = +document.getElementById('l_r').value / 100 / 12;
  const n = +document.getElementById('l_t').value * 12;
  const type = document.getElementById('l_type').value;
  let monthly, totalInterest, rows = '';

  if (type === 'equal') {
    monthly = P * r * Math.pow(1+r, n) / (Math.pow(1+r, n) - 1);
    totalInterest = monthly * n - P;
    let balance = P;
    for (let i = 1; i <= n; i++) {
      const interest = balance * r;
      const principal = monthly - interest;
      balance -= principal;
      if (i <= 12 || i % 12 === 0) {
        rows += `<tr><td>第 ${i} 期</td><td>${monthly.toFixed(2)}</td><td>${principal.toFixed(2)}</td><td>${interest.toFixed(2)}</td><td>${Math.max(balance,0).toFixed(2)}</td></tr>`;
      }
    }
  } else {
    const principalMonthly = P / n;
    let balance = P, firstMonth = 0, lastMonth = 0;
    for (let i = 1; i <= n; i++) {
      const interest = balance * r;
      const pay = principalMonthly + interest;
      if (i === 1) firstMonth = pay;
      if (i === n) lastMonth = pay;
      balance -= principalMonthly;
      if (i <= 12 || i % 12 === 0) {
        rows += `<tr><td>第 ${i} 期</td><td>${pay.toFixed(2)}</td><td>${principalMonthly.toFixed(2)}</td><td>${interest.toFixed(2)}</td><td>${Math.max(balance,0).toFixed(2)}</td></tr>`;
      }
    }
    monthly = firstMonth;
    totalInterest = (firstMonth + lastMonth) * n / 2 - P;
  }

  document.getElementById('calcResult').innerHTML = `
    <div class="result-cards">
      <div class="result-card"><div class="rc-label">${type==='equal'?'每月月供':'首月月供'}</div><div class="rc-value">¥${monthly.toFixed(2)}</div></div>
      <div class="result-card"><div class="rc-label">总利息</div><div class="rc-value">¥${totalInterest.toFixed(2)}</div></div>
      <div class="result-card"><div class="rc-label">还款总额</div><div class="rc-value">¥${(P+totalInterest).toFixed(2)}</div></div>
    </div>
    <h3 style="font-size:14px;margin:14px 0 10px;">还款计划（部分）</h3>
    <table class="result-table">
      <thead><tr><th>期数</th><th>月供</th><th>本金</th><th>利息</th><th>剩余本金</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div id="calcHistory"></div>
  `;
  saveHistory({
    type: 'loan',
    title: '房贷 · ¥' + P.toLocaleString(),
    summary: `${(+document.getElementById('l_r').value).toFixed(2)}% · ${+document.getElementById('l_t').value} 年 · 月供 ¥${monthly.toFixed(0)}`
  });
  renderHistory();
}

function calcDCA() {
  const pmt = +document.getElementById('d_pmt').value;
  const r = +document.getElementById('d_r').value / 100 / 12;
  const t = +document.getElementById('d_t').value;
  const n = t * 12;
  let fv = 0, rows = '';
  const chartPrincipal = [0], chartValue = [0];
  for (let i = 1; i <= n; i++) {
    fv = (fv + pmt) * (1 + r);
    if (i % 12 === 0) {
      const principal = pmt * i;
      chartPrincipal.push(principal);
      chartValue.push(fv);
      rows += `<tr><td>第 ${i/12} 年</td><td>${principal.toFixed(2)}</td><td>${fv.toFixed(2)}</td><td>${(fv-principal).toFixed(2)}</td></tr>`;
    }
  }
  const totalPrincipal = pmt * n;
  const profit = fv - totalPrincipal;
  document.getElementById('calcResult').innerHTML = `
    <div class="result-cards">
      <div class="result-card"><div class="rc-label">期末终值</div><div class="rc-value">¥${fv.toFixed(2)}</div></div>
      <div class="result-card"><div class="rc-label">投入本金</div><div class="rc-value">¥${totalPrincipal.toFixed(2)}</div></div>
      <div class="result-card"><div class="rc-label">累计收益</div><div class="rc-value">¥${profit.toFixed(2)}</div></div>
    </div>
    <div class="result-chart-box">
      <h3 style="font-size:14px;margin-bottom:10px;">本金 vs 账户价值</h3>
      <canvas id="resultChartDCA" height="200"></canvas>
    </div>
    <h3 style="font-size:14px;margin:14px 0 10px;">逐年明细</h3>
    <table class="result-table">
      <thead><tr><th>年份</th><th>累计本金</th><th>账户价值</th><th>累计收益</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div id="calcHistory"></div>
  `;
  drawResultChart('resultChartDCA', [
    { name: '累计投入', data: chartPrincipal },
    { name: '账户价值', data: chartValue }
  ]);
  saveHistory({
    type: 'dca',
    title: '定投 · ¥' + pmt.toLocaleString() + '/月',
    summary: `年化 ${(+document.getElementById('d_r').value).toFixed(1)}% · ${t} 年 → ¥${fv.toFixed(0)}`
  });
  renderHistory();
}

function calcBond() {
  const F = +document.getElementById('b_f').value;
  const c = +document.getElementById('b_c').value / 100;
  const y = +document.getElementById('b_y').value / 100;
  const t = +document.getElementById('b_t').value;
  const n = +document.getElementById('b_n').value;
  const periods = t * n;
  const coupon = F * c / n;
  const yPeriod = y / n;

  let price = 0, weighted = 0, convexity = 0;
  for (let i = 1; i <= periods; i++) {
    const cf = coupon + (i === periods ? F : 0);
    const pv = cf / Math.pow(1 + yPeriod, i);
    price += pv;
    weighted += i * pv;
  }
  const macaulay = weighted / price / n;
  const modified = macaulay / (1 + yPeriod);
  for (let i = 1; i <= periods; i++) {
    const cf = coupon + (i === periods ? F : 0);
    const pv = cf / Math.pow(1 + yPeriod, i);
    convexity += pv * i * (i + 1);
  }
  convexity = convexity / (price * Math.pow(1 + yPeriod, 2) * n * n);

  document.getElementById('calcResult').innerHTML = `
    <div class="result-cards">
      <div class="result-card"><div class="rc-label">债券价格</div><div class="rc-value">¥${price.toFixed(2)}</div></div>
      <div class="result-card"><div class="rc-label">修正久期</div><div class="rc-value">${modified.toFixed(2)} 年</div></div>
      <div class="result-card"><div class="rc-label">凸性</div><div class="rc-value">${convexity.toFixed(2)}</div></div>
    </div>
    <h3 style="font-size:14px;margin:14px 0 10px;">关键指标</h3>
    <table class="result-table">
      <thead><tr><th>指标</th><th>数值</th></tr></thead>
      <tbody>
        <tr><td>票息（每期）</td><td>¥${coupon.toFixed(2)}</td></tr>
        <tr><td>麦考利久期</td><td>${macaulay.toFixed(2)} 年</td></tr>
        <tr><td>修正久期</td><td>${modified.toFixed(2)}</td></tr>
        <tr><td>凸性</td><td>${convexity.toFixed(2)}</td></tr>
        <tr><td>付息期数</td><td>${periods} 期</td></tr>
      </tbody>
    </table>
    <div id="calcHistory"></div>
  `;
  saveHistory({
    type: 'bond',
    title: '债券 · 面值 ¥' + F.toLocaleString(),
    summary: `票息 ${(+document.getElementById('b_c').value).toFixed(1)}% · YTM ${(+document.getElementById('b_y').value).toFixed(1)}% → 价格 ¥${price.toFixed(2)}`
  });
  renderHistory();
}

/* ============ 事件初始化 ============ */
function initEvents() {
  const roleSelector = document.getElementById('roleSelector');
  const roleDropdown = document.getElementById('roleDropdown');
  roleSelector.addEventListener('click', (e) => {
    e.stopPropagation();
    roleDropdown.classList.toggle('open');
  });
  document.querySelectorAll('.role-option').forEach(o => {
    o.addEventListener('click', (e) => {
      e.stopPropagation();
      setRole(o.dataset.role);
      roleDropdown.classList.remove('open');
    });
  });
  document.addEventListener('click', () => roleDropdown.classList.remove('open'));

  document.querySelectorAll('.nav-menu a').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const nav = a.dataset.nav;
      if (nav === 'home') goPage('home');
      else if (nav === 'tools') scrollToSection('tools');
      else if (nav === 'data') scrollToSection('data');
      else if (nav === 'learn') scrollToSection('learn');
      else if (nav === 'about') scrollToSection('about');
    });
  });

  window.addEventListener('resize', () => { drawLineChart(); drawBarChart(); });
}

/* ============ 搜索功能 ============ */
const searchIndex = [
  { icon:'💰', name:'复利计算器',      tag:'工具', action:() => goCalc('compound') },
  { icon:'🏠', name:'房贷计算器',      tag:'工具', action:() => goCalc('loan') },
  { icon:'📊', name:'定投计算器',      tag:'工具', action:() => goCalc('dca') },
  { icon:'📜', name:'债券定价计算器',  tag:'工具', action:() => goCalc('bond') },
  { icon:'📉', name:'期权盈亏计算器',  tag:'即将上线', action:() => alert('期权盈亏计算器开发中，敬请期待！') },
  { icon:'🏢', name:'DCF 估值计算器',  tag:'即将上线', action:() => alert('DCF 估值器开发中，敬请期待！') },
  { icon:'📈', name:'市场数据看板',    tag:'数据', action:() => scrollToSection('data') },
  { icon:'📚', name:'金融知识学习中心', tag:'学习', action:() => scrollToSection('learn') },
  { icon:'🧮', name:'复利终值公式',    tag:'公式', action:() => scrollToSection('learn') },
  { icon:'🧮', name:'等额本息月供公式', tag:'公式', action:() => scrollToSection('learn') },
  { icon:'🧮', name:'定投终值公式',    tag:'公式', action:() => scrollToSection('learn') },
  { icon:'🧮', name:'债券价格公式',    tag:'公式', action:() => scrollToSection('learn') },
  { icon:'🧮', name:'夏普比率公式',    tag:'公式', action:() => scrollToSection('learn') }
];

function initSearch() {
  const box   = document.getElementById('searchBox');
  const input = document.getElementById('searchInput');
  const dd    = document.getElementById('searchDropdown');
  if (!box || !input || !dd) return;

  function render(list, keyword) {
    if (!keyword.trim()) {
      dd.innerHTML = `<div class="search-empty">输入关键词，搜索工具 / 公式 / 文章</div>`;
    } else if (list.length === 0) {
      dd.innerHTML = `<div class="search-empty">没有找到「${keyword}」相关内容</div>`;
    } else {
      dd.innerHTML = list.map((item, i) => `
        <div class="search-item" data-idx="${i}">
          <span class="si-icon">${item.icon}</span>
          <span class="si-name">${item.name}</span>
          <span class="si-tag">${item.tag}</span>
        </div>
      `).join('');
      dd.querySelectorAll('.search-item').forEach(el => {
        el.addEventListener('click', () => {
          const idx = +el.dataset.idx;
          list[idx].action();
          dd.classList.remove('open');
          input.value = '';
        });
      });
    }
  }

  input.addEventListener('input', () => {
    const kw = input.value.trim();
    const list = searchIndex.filter(x =>
      x.name.toLowerCase().includes(kw.toLowerCase()) ||
      x.tag.toLowerCase().includes(kw.toLowerCase())
    );
    render(list, input.value);
    dd.classList.add('open');
  });

  input.addEventListener('focus', () => {
    const kw = input.value.trim();
    const list = searchIndex.filter(x =>
      x.name.toLowerCase().includes(kw.toLowerCase())
    );
    render(list, input.value);
    dd.classList.add('open');
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const kw = input.value.trim();
      if (!kw) return;
      const list = searchIndex.filter(x =>
        x.name.toLowerCase().includes(kw.toLowerCase()) ||
        x.tag.toLowerCase().includes(kw.toLowerCase())
      );
      if (list.length > 0) {
        list[0].action();
        dd.classList.remove('open');
        input.value = '';
      }
    } else if (e.key === 'Escape') {
      dd.classList.remove('open');
    }
  });

  document.addEventListener('click', (e) => {
    if (!box.contains(e.target)) dd.classList.remove('open');
  });
}

/* ============ 初始化 ============ */
function init() {
  initEvents();
  initCarousel();
  renderIndices();
  drawLineChart();
  drawBarChart();
  setRole(currentRole);
  initSearch();
}

window.addEventListener('DOMContentLoaded', init);


/* ============ 主题切换 ============ */
const THEME_KEY = 'fincalc_theme';

function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = '☀️';
  } else {
    document.documentElement.removeAttribute('data-theme');
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = '🌙';
  }
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'dark';
  applyTheme(saved);
  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const next = isLight ? 'dark' : 'light';
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }
}

window.addEventListener('DOMContentLoaded', initTheme);