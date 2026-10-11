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
    { icon:'📉', title:'期权盈亏', desc:'到期盈亏图', calc:'option' },
    { icon:'🏢', title:'DCF 估值', desc:'企业价值估算', calc:'dcf' },
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
  applyRoleColor(role);
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

/* ============ 角色主题色 ============ */
const ROLE_COLORS = {
  guest:    { gold: '#f5b942', cyan: '#2ee6d6' },
  student:  { gold: '#3b82f6', cyan: '#60a5fa' },
  investor: { gold: '#22c77a', cyan: '#4ade80' },
  pro:      { gold: '#a855f7', cyan: '#c084fc' }
};

function applyRoleColor(role) {
  const c = ROLE_COLORS[role] || ROLE_COLORS.guest;
  document.documentElement.style.setProperty('--gold', c.gold);
  document.documentElement.style.setProperty('--cyan', c.cyan);
  document.documentElement.setAttribute('data-role', role);
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.style.background = `linear-gradient(90deg, ${c.gold}, ${c.cyan})`;
    logo.style.webkitBackgroundClip = 'text';
    logo.style.backgroundClip = 'text';
    logo.style.webkitTextFillColor = 'transparent';
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
      <div class="form-group"><label>年通胀率（%）</label>
        <input type="number" id="c_infl" value="3" step="0.1" />
      </div>
      <div class="preset-row">
        <span class="preset-label">预设：</span>
        <button class="preset-btn" onclick="applyPreset('compound','conservative')">🛡️ 保守 3%</button>
        <button class="preset-btn" onclick="applyPreset('compound','balanced')">⚖️ 稳健 6%</button>
        <button class="preset-btn" onclick="applyPreset('compound','aggressive')">🚀 激进 10%</button>
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
      <div class="form-group"><label>提前还款金额（元，可选）</label>
        <input type="number" id="l_prepay" value="0" />
      </div>
      <div class="form-group"><label>提前还款在第几年</label>
        <input type="number" id="l_prepay_year" value="5" />
      </div>
      <div class="preset-row">
        <span class="preset-label">预设利率：</span>
        <button class="preset-btn" onclick="applyPreset('loan','first')">🏠 首套 3.1%</button>
        <button class="preset-btn" onclick="applyPreset('loan','second')">🏡 二套 3.5%</button>
        <button class="preset-btn" onclick="applyPreset('loan','commercial')">💼 商贷 4.2%</button>
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
      <div class="preset-row">
        <span class="preset-label">预设：</span>
        <button class="preset-btn" onclick="applyPreset('dca','conservative')">🛡️ 保守 4%</button>
        <button class="preset-btn" onclick="applyPreset('dca','balanced')">⚖️ 稳健 7%</button>
        <button class="preset-btn" onclick="applyPreset('dca','aggressive')">🚀 激进 12%</button>
      </div>
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
  },
  option: {
    title: '期权盈亏计算器',
    sub: '输入标的价、行权价、权利金与方向，绘制到期盈亏曲线。',
    form: `
      <div class="form-group"><label>标的资产现价（元）</label><input type="number" id="o_s" value="100" step="0.1" /></div>
      <div class="form-group"><label>行权价（元）</label><input type="number" id="o_k" value="105" step="0.1" /></div>
      <div class="form-group"><label>权利金（元/份）</label><input type="number" id="o_p" value="3" step="0.1" /></div>
      <div class="form-group"><label>合约数量（份）</label><input type="number" id="o_q" value="1" /></div>
      <div class="form-group"><label>期权类型</label>
        <select id="o_type">
          <option value="call">看涨期权（Call）</option>
          <option value="put">看跌期权（Put）</option>
        </select>
      </div>
      <div class="form-group"><label>持仓方向</label>
        <select id="o_pos">
          <option value="long">买入（Long）</option>
          <option value="short">卖出（Short）</option>
        </select>
      </div>
      <div class="preset-row">
        <span class="preset-label">快速示例：</span>
        <button class="preset-btn" onclick="applyPreset('option','longCall')">📈 买入看涨</button>
        <button class="preset-btn" onclick="applyPreset('option','shortPut')">📉 卖出看跌</button>
      </div>
      <button class="calc-btn" onclick="calcOption()">计算盈亏</button>
    `,
    run: calcOption
  },
  dcf: {
    title: 'DCF 估值计算器',
    sub: '基于自由现金流折现模型，估算企业内在价值。',
    form: `
      <div class="form-group"><label>初始自由现金流（万元）</label><input type="number" id="d_cf" value="1000" /></div>
      <div class="form-group"><label>预测期增长率（%）</label><input type="number" id="d_g" value="10" step="0.1" /></div>
      <div class="form-group"><label>折现率 / WACC（%）</label><input type="number" id="d_r" value="8" step="0.1" /></div>
      <div class="form-group"><label>预测年限（年）</label><input type="number" id="d_n" value="5" /></div>
      <div class="form-group"><label>永续增长率（%）</label><input type="number" id="d_tg" value="3" step="0.1" /></div>
      <div class="preset-row">
        <span class="preset-label">预设：</span>
        <button class="preset-btn" onclick="applyPreset('dcf','conservative')">🛡️ 保守</button>
        <button class="preset-btn" onclick="applyPreset('dcf','balanced')">⚖️ 稳健</button>
        <button class="preset-btn" onclick="applyPreset('dcf','growth')">🚀 高成长</button>
      </div>
      <button class="calc-btn" onclick="calcDcf()">估算企业价值</button>
    `,
    run: calcDcf
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
  restoreParams(key);
  applyRoleDefaults(key);
  bindParamAutoSave(key);
  setTimeout(() => cfg.run(), 50);
  setTimeout(renderHistory, 60);
}

/* ============ 角色默认参数 ============ */
const ROLE_DEFAULTS = {
  guest:    { c_pv: 100000,   l_p: 1000000, d_pmt: 3000,  b_f: 1000,   o_q: 1,   d_cf: 1000 },
  student:  { c_pv: 10000,    l_p: 500000,  d_pmt: 500,   b_f: 1000,   o_q: 1,   d_cf: 500 },
  investor: { c_pv: 500000,   l_p: 2000000, d_pmt: 5000,  b_f: 10000,  o_q: 10,  d_cf: 5000 },
  pro:      { c_pv: 10000000, l_p: 5000000, d_pmt: 20000, b_f: 100000, o_q: 100, d_cf: 50000 }
};

/* ============ 参数记忆（localStorage） ============ */
const PARAMS_KEY = 'fincalc_params';

function getAllParams() {
  try { return JSON.parse(localStorage.getItem(PARAMS_KEY) || '{}'); } catch (e) { return {}; }
}

function saveParam(calcKey, id, value) {
  const all = getAllParams();
  if (!all[calcKey]) all[calcKey] = {};
  all[calcKey][id] = value;
  localStorage.setItem(PARAMS_KEY, JSON.stringify(all));
}

function restoreParams(calcKey) {
  const all = getAllParams();
  const saved = all[calcKey];
  if (!saved) return;
  Object.entries(saved).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  });
}

function applyRoleDefaults(calcKey) {
  const defaults = ROLE_DEFAULTS[currentRole] || ROLE_DEFAULTS.guest;
  const all = getAllParams();
  const saved = all[calcKey] || {};
  const form = document.getElementById('calcForm');
  if (!form) return;
  form.querySelectorAll('input, select').forEach(el => {
    if (!el.id) return;
    if (saved[el.id] !== undefined) return;
    if (defaults[el.id] !== undefined) {
      el.value = defaults[el.id];
    }
  });
}

function bindParamAutoSave(calcKey) {
  const form = document.getElementById('calcForm');
  if (!form) return;
  form.querySelectorAll('input, select').forEach(el => {
    if (!el.id) return;
    el.addEventListener('input', () => saveParam(calcKey, el.id, el.value));
    el.addEventListener('change', () => saveParam(calcKey, el.id, el.value));
  });
}

/* ============ 各计算器 ============ */
function calcCompound() {
  const pv = +document.getElementById('c_pv').value;
  const r = +document.getElementById('c_r').value / 100;
  const t = +document.getElementById('c_t').value;
  const n = +document.getElementById('c_n').value;
  const infl = (+(document.getElementById('c_infl') || {}).value || 0) / 100;
  const fv = pv * Math.pow(1 + r/n, n*t);
  const interest = fv - pv;
  let rows = '';
  const chartNominal = [pv];
  const chartReal = [pv];
  for (let y = 1; y <= t; y++) {
    const v = pv * Math.pow(1 + r/n, n*y);
    const real = v / Math.pow(1 + infl, y);
    chartNominal.push(v);
    chartReal.push(real);
    rows += `<tr><td>第 ${y} 年</td><td>${v.toFixed(2)}</td><td>${(v-pv).toFixed(2)}</td><td>${real.toFixed(2)}</td></tr>`;
  }
  document.getElementById('calcResult').innerHTML = `
    <div class="result-cards">
      <div class="result-card"><button class="rc-copy" onclick="copyCard(this)">📋</button><div class="rc-label">期末终值</div><div class="rc-value">¥${fv.toFixed(2)}</div></div>
      <div class="result-card"><button class="rc-copy" onclick="copyCard(this)">📋</button><div class="rc-label">利息总额</div><div class="rc-value">¥${interest.toFixed(2)}</div></div>
      <div class="result-card"><button class="rc-copy" onclick="copyCard(this)">📋</button><div class="rc-label">实际购买力</div><div class="rc-value">¥${(fv/Math.pow(1+infl,t)).toFixed(2)}</div></div>
    </div>
    <div class="summary-row">
      <button class="copy-summary" onclick="copySummary('compound', this)">📄 复制摘要</button>
    </div>
    <div class="result-chart-box">
      <h3 style="font-size:14px;margin-bottom:10px;">资产增长曲线（名义 vs 实际购买力）</h3>
      <canvas id="resultChartCompound" height="200"></canvas>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin:14px 0 10px;">
      <h3 style="font-size:14px;margin:0;">逐年明细</h3>
      <button class="export-csv" onclick="exportTableCSV(this)">📥 导出 CSV</button>
    </div>
    <table class="result-table">
      <thead><tr><th>年份</th><th>终值</th><th>累计利息</th><th>实际购买力</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div id="calcHistory"></div>
    ${renderFormulaPanel([
      { label: '复利终值公式', formula: 'FV = PV × (1 + r/n)^(n×t)' },
      { label: '代入数值', formula: `FV = ${pv} × (1 + ${r}/${n})^(${n}×${t})` },
      { label: '计算结果', formula: `FV = ${fv.toFixed(2)}`, result: `¥${fv.toFixed(2)}` }
    ])}
  `;
  drawResultChart('resultChartCompound', [
    { name: '名义价值', data: chartNominal },
    { name: '实际购买力', data: chartReal }
  ]);
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

  // ===== 提前还款模拟 =====
  const prepay = +document.getElementById('l_prepay').value || 0;
  const prepayYear = +document.getElementById('l_prepay_year').value || 5;
  const totalYears = +document.getElementById('l_t').value;
  const prepayValid = prepay > 0 && prepayYear <= totalYears;
  let savedInterest = 0;

  if (prepayValid) {
    let balance = P;
    let paidInterest = 0;
    const prepayMonth = prepayYear * 12;
    for (let i = 1; i <= n; i++) {
      const interest = balance * r;
      let principal = 0;
      if (type === 'equal') {
        principal = monthly - interest;
      } else {
        principal = P / n;
      }
      balance -= principal;
      paidInterest += interest;
      if (i === prepayMonth) {
        balance -= prepay;
        if (balance < 0) balance = 0;
      }
      if (balance <= 0) break;
    }

    if (balance > 0) {
      const remainMonths = n - prepayMonth;
      if (remainMonths > 0 && r > 0) {
        const newMonthly = balance * r * Math.pow(1 + r, remainMonths) / (Math.pow(1 + r, remainMonths) - 1);
        const newTotalInterest = paidInterest + newMonthly * remainMonths - balance;
        savedInterest = totalInterest - newTotalInterest;
      } else {
        savedInterest = totalInterest - paidInterest;
      }
    } else {
      savedInterest = totalInterest - paidInterest;
    }
  }

  document.getElementById('calcResult').innerHTML = `
    <div class="result-cards">
      <div class="result-card"><button class="rc-copy" onclick="copyCard(this)">📋</button><div class="rc-label">${type==='equal'?'每月月供':'首月月供'}</div><div class="rc-value">¥${monthly.toFixed(2)}</div></div>
      <div class="result-card"><button class="rc-copy" onclick="copyCard(this)">📋</button><div class="rc-label">总利息</div><div class="rc-value">¥${totalInterest.toFixed(2)}</div></div>
      <div class="result-card"><button class="rc-copy" onclick="copyCard(this)">📋</button><div class="rc-label">还款总额</div><div class="rc-value">¥${(P+totalInterest).toFixed(2)}</div></div>
      ${prepayValid ? `
        <div class="result-card">
          <button class="rc-copy" onclick="copyCard(this)">📋</button>
          <div class="rc-label">提前还款节省利息</div>
          <div class="rc-value">¥${savedInterest.toFixed(2)}</div>
        </div>
      ` : ''}
    </div>
    <div class="summary-row">
      <button class="copy-summary" onclick="copySummary('loan', this)">📄 复制摘要</button>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin:14px 0 10px;">
      <h3 style="font-size:14px;margin:0;">还款计划（部分）</h3>
      <button class="export-csv" onclick="exportTableCSV(this)">📥 导出 CSV</button>
    </div>
    <table class="result-table">
      <thead><tr><th>期数</th><th>月供</th><th>本金</th><th>利息</th><th>剩余本金</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
      <div id="calcHistory"></div>
    ${renderFormulaPanel([
      { label: type === 'equal' ? '等额本息月供公式' : '等额本金月供公式',
        formula: type === 'equal'
          ? 'M = P × r × (1+r)^n / [(1+r)^n - 1]'
          : 'M = P/n + 剩余本金 × r' },
      { label: '代入数值',
        formula: type === 'equal'
          ? `M = ${P} × ${r.toFixed(6)} × (1+${r.toFixed(6)})^${n} / [(1+${r.toFixed(6)})^${n} - 1]`
          : `M₁ = ${P}/${n} + ${P} × ${r.toFixed(6)}` },
      { label: '月供结果', formula: `M = ${monthly.toFixed(2)}`, result: `¥${monthly.toFixed(2)}` }
    ])}
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
      <div class="result-card"><button class="rc-copy" onclick="copyCard(this)">📋</button><div class="rc-label">期末终值</div><div class="rc-value">¥${fv.toFixed(2)}</div></div>
      <div class="result-card"><button class="rc-copy" onclick="copyCard(this)">📋</button><div class="rc-label">投入本金</div><div class="rc-value">¥${totalPrincipal.toFixed(2)}</div></div>
      <div class="result-card"><button class="rc-copy" onclick="copyCard(this)">📋</button><div class="rc-label">累计收益</div><div class="rc-value">¥${profit.toFixed(2)}</div></div>
    </div>
    <div class="summary-row">
      <button class="copy-summary" onclick="copySummary('dca', this)">📄 复制摘要</button>
    </div>
    <div class="result-chart-box">
      <h3 style="font-size:14px;margin-bottom:10px;">本金 vs 账户价值</h3>
      <canvas id="resultChartDCA" height="200"></canvas>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin:14px 0 10px;">
      <h3 style="font-size:14px;margin:0;">逐年明细</h3>
      <button class="export-csv" onclick="exportTableCSV(this)">📥 导出 CSV</button>
    </div>
    <table class="result-table">
      <thead><tr><th>年份</th><th>累计本金</th><th>账户价值</th><th>累计收益</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
      <div id="calcHistory"></div>
    ${renderFormulaPanel([
      { label: '定投终值公式', formula: 'FV = PMT × [((1+r)^n - 1) / r]' },
      { label: '代入数值', formula: `FV = ${pmt} × [((1+${r.toFixed(6)})^${n} - 1) / ${r.toFixed(6)}]` },
      { label: '计算结果', formula: `FV = ${fv.toFixed(2)}`, result: `¥${fv.toFixed(2)}` }
    ])}
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

  // DV01：YTM 每变动 1bp，价格变化
  const dv01 = modified * price * 0.0001;

  document.getElementById('calcResult').innerHTML = `
    <div class="result-cards">
      <div class="result-card"><button class="rc-copy" onclick="copyCard(this)">📋</button><div class="rc-label">债券价格</div><div class="rc-value">¥${price.toFixed(2)}</div></div>
      <div class="result-card"><button class="rc-copy" onclick="copyCard(this)">📋</button><div class="rc-label">修正久期</div><div class="rc-value">${modified.toFixed(2)} 年</div></div>
      <div class="result-card"><button class="rc-copy" onclick="copyCard(this)">📋</button><div class="rc-label">DV01</div><div class="rc-value">¥${dv01.toFixed(4)}</div></div>
    </div>
    <div class="summary-row">
      <button class="copy-summary" onclick="copySummary('bond', this)">📄 复制摘要</button>
    </div>
    <div class="result-chart-box">
      <h3 style="font-size:14px;margin-bottom:10px;">价格-收益率曲线</h3>
      <canvas id="resultChartBond" height="200"></canvas>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin:14px 0 10px;">
      <h3 style="font-size:14px;margin:0;">关键指标</h3>
      <button class="export-csv" onclick="exportTableCSV(this)">📥 导出 CSV</button>
    </div>
    <table class="result-table">
      <thead><tr><th>指标</th><th>数值</th></tr></thead>
      <tbody>
        <tr><td>票息（每期）</td><td>¥${coupon.toFixed(2)}</td></tr>
        <tr><td>麦考利久期</td><td>${macaulay.toFixed(2)} 年</td></tr>
        <tr><td>修正久期</td><td>${modified.toFixed(2)}</td></tr>
        <tr><td>凸性</td><td>${convexity.toFixed(2)}</td></tr>
        <tr><td>DV01（1bp）</td><td>¥${dv01.toFixed(4)}</td></tr>
        <tr><td>付息期数</td><td>${periods} 期</td></tr>
      </tbody>
    </table>
      <div id="calcHistory"></div>
    ${renderFormulaPanel([
      { label: '债券定价公式', formula: 'P = Σ C/(1+y)^t + F/(1+y)^n' },
      { label: '代入数值', formula: `P = Σ ${coupon.toFixed(2)}/(1+${yPeriod.toFixed(6)})^t + ${F}/(1+${yPeriod.toFixed(6)})^${periods}` },
      { label: '债券价格', formula: `P = ${price.toFixed(2)}`, result: `¥${price.toFixed(2)}` }
    ])}
  `;
  drawBondChart('resultChartBond', F, c, y, t, n);
  saveHistory({
    type: 'bond',
    title: '债券 · 面值 ¥' + F.toLocaleString(),
    summary: `票息 ${(+document.getElementById('b_c').value).toFixed(1)}% · YTM ${(+document.getElementById('b_y').value).toFixed(1)}% → 价格 ¥${price.toFixed(2)}`
  });
  renderHistory();
}
function drawBondChart(canvasId, F, c, y, t, n) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth || 500;
  const H = canvas.height = 200;
  const pad = { l: 55, r: 20, t: 20, b: 28 };

  // 生成价格-收益率曲线：YTM 从 0.5y 到 1.5y
  const periods = t * n;
  const coupon = F * c / n;
  const yMin = Math.max(y * 0.3, 0.001);
  const yMax = y * 1.8;
  const steps = 50;
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const yy = yMin + (yMax - yMin) * i / steps;
    const yP = yy / n;
    let p = 0;
    for (let k = 1; k <= periods; k++) {
      const cf = coupon + (k === periods ? F : 0);
      p += cf / Math.pow(1 + yP, k);
    }
    points.push({ y: yy, p });
  }

  const prices = points.map(pt => pt.p);
  const maxP = Math.max(...prices) * 1.05;
  const minP = Math.min(...prices) * 0.95;
  const range = maxP - minP || 1;

  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = '#243049'; ctx.lineWidth = 1;
  ctx.fillStyle = '#8fa3c8'; ctx.font = '10px sans-serif'; ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const yy = pad.t + (H - pad.t - pad.b) * i / 4;
    ctx.beginPath(); ctx.moveTo(pad.l, yy); ctx.lineTo(W - pad.r, yy); ctx.stroke();
    const val = maxP - range * i / 4;
    ctx.fillText(val.toFixed(1), pad.l - 6, yy + 3);
  }

  // 画曲线
  ctx.beginPath();
  points.forEach((pt, i) => {
    const x = pad.l + (W - pad.l - pad.r) * (pt.y - yMin) / (yMax - yMin);
    const yy = H - pad.b - (H - pad.t - pad.b) * (pt.p - minP) / range;
    i === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
  });
  ctx.strokeStyle = '#f5b942'; ctx.lineWidth = 2.2; ctx.stroke();

  // 标注当前 YTM 点
  const curX = pad.l + (W - pad.l - pad.r) * (y - yMin) / (yMax - yMin);
  let curP = 0;
  const yP = y / n;
  for (let k = 1; k <= periods; k++) {
    const cf = coupon + (k === periods ? F : 0);
    curP += cf / Math.pow(1 + yP, k);
  }
  const curY = H - pad.b - (H - pad.t - pad.b) * (curP - minP) / range;
  if (curX > pad.l && curX < W - pad.r) {
    ctx.strokeStyle = '#2ee6d6'; ctx.setLineDash([4, 4]); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(curX, pad.t); ctx.lineTo(curX, H - pad.b); ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath(); ctx.arc(curX, curY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#2ee6d6'; ctx.fill();
    ctx.fillStyle = '#2ee6d6'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('当前 YTM ' + (y * 100).toFixed(2) + '%', curX, pad.t - 4);
  }

  ctx.fillStyle = '#f5b942';
  ctx.fillRect(pad.l, 4, 10, 3);
  ctx.fillStyle = '#8fa3c8';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('债券价格', pad.l + 14, 8);
}

function calcOption() {
  const S = +document.getElementById('o_s').value;
  const K = +document.getElementById('o_k').value;
  const P = +document.getElementById('o_p').value;
  const Q = +document.getElementById('o_q').value;
  const type = document.getElementById('o_type').value;
  const pos = document.getElementById('o_pos').value;

  const dir = pos === 'long' ? 1 : -1;

  function payoff(ST) {
    let intrinsic = 0;
    if (type === 'call') intrinsic = Math.max(ST - K, 0);
    else intrinsic = Math.max(K - ST, 0);
    return dir * (intrinsic - P) * Q * 100;
  }

  const sMin = 0;
  const sMax = Math.max(K * 2, S * 1.5);
  const steps = 40;
  const chartData = [];
  for (let i = 0; i <= steps; i++) {
    const st = sMin + (sMax - sMin) * i / steps;
    chartData.push(payoff(st));
  }

  const breakevenText = type === 'call' ? (K + P).toFixed(2) : (K - P).toFixed(2);

  const profitText = pos === 'long'
    ? (type === 'call' ? '无限' : `¥${((K - P) * Q * 100).toFixed(2)}`)
    : `¥${(P * Q * 100).toFixed(2)}`;
  const lossText = pos === 'long'
    ? `¥${(P * Q * 100).toFixed(2)}`
    : (type === 'call' ? '无限' : `¥${((K - P) * Q * 100).toFixed(2)}`);

  document.getElementById('calcResult').innerHTML = `
    <div class="result-cards">
      <div class="result-card"><button class="rc-copy" onclick="copyCard(this)">📋</button><div class="rc-label">最大盈利</div><div class="rc-value">${profitText}</div></div>
      <div class="result-card"><button class="rc-copy" onclick="copyCard(this)">📋</button><div class="rc-label">最大亏损</div><div class="rc-value">${lossText}</div></div>
      <div class="result-card"><button class="rc-copy" onclick="copyCard(this)">📋</button><div class="rc-label">盈亏平衡点</div><div class="rc-value">¥${breakevenText}</div></div>
    </div>
    <div class="summary-row">
      <button class="copy-summary" onclick="copySummary('option', this)">📄 复制摘要</button>
    </div>
    <div class="result-chart-box">
      <h3 style="font-size:14px;margin-bottom:10px;">到期盈亏曲线</h3>
      <canvas id="resultChartOption" height="200"></canvas>
    </div>
    <div id="calcHistory"></div>
  `;
  drawOptionChart('resultChartOption', chartData, sMin, sMax, K);
  saveHistory({
    type: 'option',
    title: (type === 'call' ? '看涨' : '看跌') + ' · ' + (pos === 'long' ? '买入' : '卖出'),
    summary: `行权价 ${K} · 权利金 ${P} · 平衡点 ¥${breakevenText}`
  });
  renderHistory();
}

function drawOptionChart(canvasId, data, sMin, sMax, K) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth || 500;
  const H = canvas.height = 200;
  const pad = { l: 55, r: 20, t: 20, b: 28 };
  const max = Math.max(...data, 0) * 1.1;
  const min = Math.min(...data, 0) * 1.1;
  const range = max - min || 1;
  ctx.clearRect(0, 0, W, H);

  ctx.strokeStyle = '#243049'; ctx.lineWidth = 1;
  ctx.fillStyle = '#8fa3c8'; ctx.font = '10px sans-serif'; ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const y = pad.t + (H - pad.t - pad.b) * i / 4;
    ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y); ctx.stroke();
    const val = max - range * i / 4;
    ctx.fillText(formatShort(val), pad.l - 6, y + 3);
  }

  const y0 = H - pad.b - (H - pad.t - pad.b) * (0 - min) / range;
  ctx.strokeStyle = '#8fa3c8'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(pad.l, y0); ctx.lineTo(W - pad.r, y0); ctx.stroke();

  ctx.beginPath();
  data.forEach((v, i) => {
    const x = pad.l + (W - pad.l - pad.r) * i / (data.length - 1);
    const y = H - pad.b - (H - pad.t - pad.b) * (v - min) / range;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.strokeStyle = '#f5b942'; ctx.lineWidth = 2.5; ctx.stroke();

  const xK = pad.l + (W - pad.l - pad.r) * (K - sMin) / (sMax - sMin);
  if (xK > pad.l && xK < W - pad.r) {
    ctx.strokeStyle = '#2ee6d6'; ctx.setLineDash([4, 4]); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(xK, pad.t); ctx.lineTo(xK, H - pad.b); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#2ee6d6'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('行权价 ' + K, xK, pad.t - 4);
  }

  ctx.fillStyle = '#f5b942';
  ctx.fillRect(pad.l, 4, 10, 3);
  ctx.fillStyle = '#8fa3c8';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('到期盈亏', pad.l + 14, 8);
}

function calcDcf() {
  const cf0 = +document.getElementById('d_cf').value;
  const g = +document.getElementById('d_g').value / 100;
  const r = +document.getElementById('d_r').value / 100;
  const n = +document.getElementById('d_n').value;
  const tg = +document.getElementById('d_tg').value / 100;

  if (r <= tg) { alert('折现率必须大于永续增长率，否则永续价值无穷大'); return; }

  let rows = '';
  let pvSum = 0;
  const chartLabels = ['初始'];
  const chartValues = [cf0];

  let cf = cf0;
  for (let y = 1; y <= n; y++) {
    cf = cf * (1 + g);
    const pv = cf / Math.pow(1 + r, y);
    pvSum += pv;
    chartLabels.push('第 ' + y + ' 年');
    chartValues.push(cf);
    rows += `<tr><td>第 ${y} 年</td><td>${cf.toFixed(2)}</td><td>${pv.toFixed(2)}</td><td>${pvSum.toFixed(2)}</td></tr>`;
  }

  const terminalCF = cf * (1 + tg);
  const terminalValue = terminalCF / (r - tg);
  const terminalPV = terminalValue / Math.pow(1 + r, n);
  const enterpriseValue = pvSum + terminalPV;

  document.getElementById('calcResult').innerHTML = `
    <div class="result-cards">
      <div class="result-card"><button class="rc-copy" onclick="copyCard(this)">📋</button><div class="rc-label">预测期现值</div><div class="rc-value">¥${pvSum.toFixed(2)} 万</div></div>
      <div class="result-card"><button class="rc-copy" onclick="copyCard(this)">📋</button><div class="rc-label">永续价值现值</div><div class="rc-value">¥${terminalPV.toFixed(2)} 万</div></div>
      <div class="result-card"><button class="rc-copy" onclick="copyCard(this)">📋</button><div class="rc-label">企业总价值</div><div class="rc-value">¥${enterpriseValue.toFixed(2)} 万</div></div>
    </div>
    <div class="summary-row">
      <button class="copy-summary" onclick="copySummary('dcf', this)">📄 复制摘要</button>
    </div>
    <div class="result-chart-box">
      <h3 style="font-size:14px;margin-bottom:10px;">自由现金流预测</h3>
      <canvas id="resultChartDcf" height="200"></canvas>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin:14px 0 10px;">
      <h3 style="font-size:14px;margin:0;">逐年明细</h3>
      <button class="export-csv" onclick="exportTableCSV(this)">📥 导出 CSV</button>
    </div>
    <table class="result-table">
      <thead><tr><th>年份</th><th>自由现金流</th><th>折现现值</th><th>累计现值</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div id="calcHistory"></div>
    ${renderHeatmap(cf0, g, n)}
  `;
  drawDcfChart('resultChartDcf', chartLabels, chartValues);
  saveHistory({
    type: 'dcf',
    title: 'DCF · 初始 CF ¥' + cf0 + '万',
    summary: `增长 ${(+document.getElementById('d_g').value).toFixed(1)}% · 折现 ${(+document.getElementById('d_r').value).toFixed(1)}% · ${n} 年 → 估值 ¥${enterpriseValue.toFixed(0)} 万`
  });
  renderHistory();
}

function drawDcfChart(canvasId, labels, values) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth || 500;
  const H = canvas.height = 200;
  const pad = { l: 55, r: 20, t: 20, b: 32 };
  const max = Math.max(...values) * 1.1;
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

  const gap = (W - pad.l - pad.r) / values.length;
  const barW = gap * 0.6;
  values.forEach((v, i) => {
    const x = pad.l + gap * i + gap * 0.2;
    const barH = (H - pad.t - pad.b) * (v - min) / (max - min);
    const y = H - pad.b - barH;
    const grad = ctx.createLinearGradient(0, y, 0, H - pad.b);
    grad.addColorStop(0, '#f5b942');
    grad.addColorStop(1, 'rgba(245,185,66,0.3)');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, barW, barH);

    ctx.fillStyle = '#8fa3c8';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + barW / 2, H - 10);

    ctx.fillStyle = '#f5b942';
    ctx.fillText(formatShort(v), x + barW / 2, y - 4);
  });

  ctx.fillStyle = '#f5b942';
  ctx.fillRect(pad.l, 4, 10, 3);
  ctx.fillStyle = '#8fa3c8';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('自由现金流', pad.l + 14, 8);
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
  { icon:'📉', name:'期权盈亏计算器',  tag:'工具', action:() => goCalc('option') },
  { icon:'🏢', name:'DCF 估值计算器',  tag:'工具', action:() => goCalc('dcf') },
  { icon:'📈', name:'市场数据看板',    tag:'数据', action:() => scrollToSection('data') },
  { icon:'📚', name:'金融知识学习中心', tag:'学习', action:() => scrollToSection('learn') },
  { icon:'🧮', name:'复利终值公式',    tag:'公式', action:() => scrollToSection('learn') },
  { icon:'🧮', name:'等额本息月供公式', tag:'公式', action:() => scrollToSection('learn') },
  { icon:'🧮', name:'定投终值公式',    tag:'公式', action:() => scrollToSection('learn') },
  { icon:'🧮', name:'债券价格公式',    tag:'公式', action:() => scrollToSection('learn') },
  { icon:'🧮', name:'夏普比率公式',    tag:'公式', action:() => scrollToSection('learn') },
  { icon:'📖', name:'货币时间价值',    tag:'文章', action:() => openArticle('tvm') },
  { icon:'📖', name:'等额本息 vs 等额本金', tag:'文章', action:() => openArticle('loanCompare') },
  { icon:'📖', name:'定投的数学原理',  tag:'文章', action:() => openArticle('dcaTheory') },
  { icon:'📖', name:'债券价格与收益率', tag:'文章', action:() => openArticle('bondYield') }
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

window.addEventListener('DOMContentLoaded', init);/* ============ 主题切换 ============ */
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


/* ============ 结果一键复制 ============ */
function copyCard(btn) {
  const card = btn.closest('.result-card');
  if (!card) return;
  const valueEl = card.querySelector('.rc-value');
  if (!valueEl) return;
  const text = valueEl.textContent.trim();

  function showCopied() {
    const old = btn.textContent;
    btn.textContent = '✅';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = old;
      btn.classList.remove('copied');
    }, 1500);
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(showCopied).catch(() => {
      fallbackCopy(text, showCopied);
    });
  } else {
    fallbackCopy(text, showCopied);
  }
}

function fallbackCopy(text, cb) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); cb(); } catch (e) {}
  document.body.removeChild(ta);
}


/* ============ 导出表格为 CSV ============ */
function exportTableCSV(btn) {
  const container = btn.closest('.calc-result') || document;
  const table = container.querySelector('.result-table');
  if (!table) { alert('没有可导出的表格'); return; }

  const rows = [];
  const ths = table.querySelectorAll('thead th');
  rows.push(Array.from(ths).map(th => `"${th.textContent.trim()}"`).join(','));

  table.querySelectorAll('tbody tr').forEach(tr => {
    const tds = tr.querySelectorAll('td');
    rows.push(Array.from(tds).map(td => {
      const t = td.textContent.trim().replace(/"/g, '""');
      return `"${t}"`;
    }).join(','));
  });

  const csv = '\ufeff' + rows.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'fincalc-export-' + Date.now() + '.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  const old = btn.textContent;
  btn.textContent = '✅ 已下载';
  btn.classList.add('exported');
  setTimeout(() => {
    btn.textContent = old;
    btn.classList.remove('exported');
  }, 1500);
}
/* ============ 复制结果摘要 ============ */
const SITE_URL = 'https://ni-97e.pages.dev';

function copySummary(calcKey, btn) {
  let text = '';
  const g = (id) => (document.getElementById(id) || {}).value || '';

  if (calcKey === 'compound') {
    const pv = +g('c_pv'), r = +g('c_r'), t = +g('c_t');
    const cards = document.querySelectorAll('.result-card .rc-value');
    text = `【复利计算器 · FinCalc Pro】\n` +
           `本金：${pv.toLocaleString()} 元\n` +
           `年利率：${r}% · ${t} 年\n` +
           `期末终值：${cards[0] ? cards[0].textContent : ''}\n` +
           `利息总额：${cards[1] ? cards[1].textContent : ''}\n` +
           `实际购买力：${cards[2] ? cards[2].textContent : ''}`;
  } else if (calcKey === 'loan') {
    const P = +g('l_p'), r = +g('l_r'), t = +g('l_t');
    const cards = document.querySelectorAll('.result-card .rc-value');
    text = `【房贷计算器 · FinCalc Pro】\n` +
           `贷款金额：${P.toLocaleString()} 元\n` +
           `年利率：${r}% · ${t} 年\n` +
           `每月月供：${cards[0] ? cards[0].textContent : ''}\n` +
           `总利息：${cards[1] ? cards[1].textContent : ''}\n` +
           `还款总额：${cards[2] ? cards[2].textContent : ''}`;
  } else if (calcKey === 'dca') {
    const pmt = +g('d_pmt'), r = +g('d_r'), t = +g('d_t');
    const cards = document.querySelectorAll('.result-card .rc-value');
    text = `【定投计算器 · FinCalc Pro】\n` +
           `每月投入：${pmt.toLocaleString()} 元\n` +
           `年化收益：${r}% · ${t} 年\n` +
           `期末终值：${cards[0] ? cards[0].textContent : ''}\n` +
           `投入本金：${cards[1] ? cards[1].textContent : ''}\n` +
           `累计收益：${cards[2] ? cards[2].textContent : ''}`;
  } else if (calcKey === 'bond') {
    const F = +g('b_f'), c = +g('b_c'), y = +g('b_y'), t = +g('b_t');
    const cards = document.querySelectorAll('.result-card .rc-value');
    text = `【债券定价计算器 · FinCalc Pro】\n` +
           `面值：${F.toLocaleString()} 元\n` +
           `票息率：${c}% · YTM：${y}% · ${t} 年\n` +
           `债券价格：${cards[0] ? cards[0].textContent : ''}\n` +
           `修正久期：${cards[1] ? cards[1].textContent : ''}\n` +
           `DV01：${cards[2] ? cards[2].textContent : ''}`;
  } else if (calcKey === 'option') {
    const S = +g('o_s'), K = +g('o_k'), P = +g('o_p');
    const type = g('o_type') === 'call' ? '看涨' : '看跌';
    const pos = g('o_pos') === 'long' ? '买入' : '卖出';
    const cards = document.querySelectorAll('.result-card .rc-value');
    text = `【期权盈亏计算器 · FinCalc Pro】\n` +
           `${type}期权 · ${pos}\n` +
           `标的价：${S} · 行权价：${K} · 权利金：${P}\n` +
           `最大盈利：${cards[0] ? cards[0].textContent : ''}\n` +
           `最大亏损：${cards[1] ? cards[1].textContent : ''}\n` +
           `盈亏平衡点：${cards[2] ? cards[2].textContent : ''}`;
  } else if (calcKey === 'dcf') {
    const cf = +g('d_cf'), gr = +g('d_g'), r = +g('d_r'), n = +g('d_n'), tg = +g('d_tg');
    const cards = document.querySelectorAll('.result-card .rc-value');
    text = `【DCF 估值计算器 · FinCalc Pro】\n` +
           `初始 CF：${cf.toLocaleString()} 万 · 增长：${gr}%\n` +
           `折现率：${r}% · 永续增长：${tg}% · ${n} 年\n` +
           `预测期现值：${cards[0] ? cards[0].textContent : ''}\n` +
           `永续价值现值：${cards[1] ? cards[1].textContent : ''}\n` +
           `企业总价值：${cards[2] ? cards[2].textContent : ''}`;
  }

  text += `\n———————————\n来自 FinCalc Pro 金融计算器\n${SITE_URL}`;

  const doSuccess = () => {
    const old = btn.textContent;
    btn.textContent = '✅ 已复制';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = old;
      btn.classList.remove('copied');
    }, 1500);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(doSuccess).catch(() => {
      fallbackCopySummary(text, doSuccess);
    });
  } else {
    fallbackCopySummary(text, doSuccess);
  }
}

function fallbackCopySummary(text, cb) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); cb(); } catch (e) {}
  document.body.removeChild(ta);
}


/* ============ 计算器预设方案 ============ */
const PRESETS = {
  compound: {
    conservative: { c_r: 3 },
    balanced:     { c_r: 6 },
    aggressive:   { c_r: 10 }
  },
  dca: {
    conservative: { d_r: 4 },
    balanced:     { d_r: 7 },
    aggressive:   { d_r: 12 }
  },
  loan: {
    first:      { l_r: 3.1 },
    second:     { l_r: 3.5 },
    commercial: { l_r: 4.2 }
  },
  option: {
    longCall:  { o_type: 'call', o_pos: 'long' },
    shortPut:  { o_type: 'put',  o_pos: 'short' }
  },
  dcf: {
    conservative: { d_g: 5,  d_r: 10, d_tg: 2 },
    balanced:     { d_g: 10, d_r: 8,  d_tg: 3 },
    growth:       { d_g: 20, d_r: 12, d_tg: 4 }
  }
};

function applyPreset(calcKey, presetKey) {
  const preset = PRESETS[calcKey] && PRESETS[calcKey][presetKey];
  if (!preset) return;
  Object.entries(preset).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  });
  if (calcKey === 'compound') calcCompound();
  else if (calcKey === 'dca') calcDCA();
  else if (calcKey === 'loan') calcLoan();
  else if (calcKey === 'option') calcOption();
  else if (calcKey === 'dcf') calcDcf();
}
/* ============ 文章内容（弹窗显示） ============ */
const ARTICLES = {
  tvm: {
    title: '货币时间价值：今天的一块钱为什么比明天更值钱？',
    tag: '基础',
    content: `
      <h3>什么是货币时间价值？</h3>
      <p>同样是一块钱，今天拿到和一年后拿到，价值是不一样的。今天的一块钱可以立即投资产生收益，而一年后的一块钱则错过了这一年的机会。</p>
      <h3>核心概念</h3>
      <ul>
        <li><strong>现值（PV）</strong>：未来的钱折算到今天的价值</li>
        <li><strong>终值（FV）</strong>：今天的钱在未来某个时间点的价值</li>
        <li><strong>贴现率（r）</strong>：把未来价值折算成现值的利率</li>
      </ul>
      <h3>核心公式</h3>
      <p style="font-family:monospace;color:var(--gold);">FV = PV × (1 + r)^t</p>
      <p>这个公式是所有金融计算的基础。复利、贷款、定投、债券定价，全部建立在这个基础上。</p>
      <h3>举个栗子</h3>
      <p>今天存 10 万元，年利率 8%，10 年后变成：</p>
      <p style="font-family:monospace;color:var(--gold);">100000 × (1 + 0.08)^10 ≈ 215892 元</p>
      <p>利息超过本金，这就是复利的力量。</p>
    `
  },
  loanCompare: {
    title: '等额本息 vs 等额本金：哪种还款方式更适合你？',
    tag: '贷款',
    content: `
      <h3>两种还款方式的本质区别</h3>
      <p><strong>等额本息</strong>：每月还款额固定，前期利息多本金少，后期利息少本金多。</p>
      <p><strong>等额本金</strong>：每月本金固定，利息逐月递减，月供前高后低。</p>
      <h3>对比</h3>
      <ul>
        <li><strong>月供压力</strong>：等额本金前期压力大，等额本息每月相同</li>
        <li><strong>总利息</strong>：等额本金总利息更少（因为本金还的快）</li>
        <li><strong>提前还款</strong>：等额本金更适合提前还，因为利息已经省了不少</li>
      </ul>
      <h3>怎么选？</h3>
      <p>收入稳定、希望月供固定 → 选等额本息</p>
      <p>收入较高、希望总利息少 → 选等额本金</p>
    `
  },
  dcaTheory: {
    title: '定投的数学原理：为什么波动反而可能是朋友？',
    tag: '投资',
    content: `
      <h3>定投的核心逻辑</h3>
      <p>每月固定金额买入，价格高时买得少，价格低时买得多，长期下来平均成本被"平滑"。</p>
      <h3>为什么波动是朋友？</h3>
      <p>假设每月投 3000 元：</p>
      <ul>
        <li>价格 10 元时 → 买 300 份</li>
        <li>价格 5 元时 → 买 600 份</li>
        <li>价格 15 元时 → 买 200 份</li>
      </ul>
      <p>低价时买得多，这就是定投"越跌越买"的数学原理。</p>
      <h3>定投终值公式</h3>
      <p style="font-family:monospace;color:var(--gold);">FV = PMT × [((1+r)^n - 1) / r]</p>
      <p>其中 PMT 是每月投入，r 是月化收益率，n 是总期数。</p>
    `
  },
  bondYield: {
    title: '债券价格与收益率：为什么利率上升，债券价格下降？',
    tag: '债券',
    content: `
      <h3>债券定价的核心</h3>
      <p>债券价格 = 未来所有现金流的现值之和。</p>
      <p style="font-family:monospace;color:var(--gold);">P = Σ C/(1+y)^t + F/(1+y)^n</p>
      <h3>为什么利率上升，价格下降？</h3>
      <p>债券的票息是固定的。当市场利率上升时，新发行的债券票息更高，你手里的老债券就"不香了"，只能降价出售，直到收益率追上市场水平。</p>
      <h3>久期与凸性</h3>
      <p><strong>久期</strong>：衡量债券价格对利率变化的敏感度。久期越长，价格波动越大。</p>
      <p><strong>凸性</strong>：久期的补充，用来修正久期在大幅利率变动时的偏差。</p>
    `
  }
};

function openArticle(key) {
  const art = ARTICLES[key];
  if (!art) return;
  const old = document.getElementById('articleModal');
  if (old) old.remove();

  const modal = document.createElement('div');
  modal.id = 'articleModal';
  modal.className = 'article-modal';
  modal.innerHTML = `
    <div class="article-modal-mask" onclick="closeArticle()"></div>
    <div class="article-modal-box">
      <div class="article-modal-head">
        <span class="article-modal-tag">${art.tag}</span>
        <button class="article-modal-close" onclick="closeArticle()">✕</button>
      </div>
      <h2 class="article-modal-title">${art.title}</h2>
      <div class="article-modal-body">${art.content}</div>
    </div>
  `;
  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('open'));
}

function closeArticle() {
  const modal = document.getElementById('articleModal');
  if (!modal) return;
  modal.classList.remove('open');
  setTimeout(() => modal.remove(), 250);
}


/* ============ 工具卡片收藏 ============ */
const FAV_KEY = 'fincalc_favorites';

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
  } catch (e) { return []; }
}

function saveFavorites(list) {
  localStorage.setItem(FAV_KEY, JSON.stringify(list));
}

function toggleFav(event, toolId) {
  event.stopPropagation();
  let favs = getFavorites();
  const idx = favs.indexOf(toolId);
  if (idx >= 0) {
    favs.splice(idx, 1);
  } else {
    favs.push(toolId);
  }
  saveFavorites(favs);
  applyFavorites();
}

function applyFavorites() {
  const grid = document.getElementById('toolsGrid');
  if (!grid) return;
  const favs = getFavorites();
  const cards = Array.from(grid.querySelectorAll('.tool-card'));

  cards.forEach(card => {
    const id = card.dataset.tool;
    const btn = card.querySelector('.fav-btn');
    if (!btn) return;
    if (favs.includes(id)) {
      btn.textContent = '★';
      btn.classList.add('active');
    } else {
      btn.textContent = '☆';
      btn.classList.remove('active');
    }
  });

  const sorted = cards.slice().sort((a, b) => {
    const aFav = favs.includes(a.dataset.tool) ? 0 : 1;
    const bFav = favs.includes(b.dataset.tool) ? 0 : 1;
    return aFav - bFav;
  });
  sorted.forEach(card => grid.appendChild(card));
}

window.addEventListener('DOMContentLoaded', applyFavorites);


/* ============ DCF 敏感性热力图 ============ */
function renderHeatmap(baseCF, g, n) {
  const waccList = [6, 7, 8, 9, 10];
  const tgList = [2, 2.5, 3, 3.5, 4];

  let html = '<div class="heatmap-wrap">';
  html += '<h3 class="heatmap-title">🔥 敏感性分析（WACC × 永续增长）</h3>';
  html += '<div class="heatmap">';
  html += '<div class="heatmap-cell heatmap-head">WACC \\ g</div>';
  tgList.forEach(t => {
    html += `<div class="heatmap-cell heatmap-head">${t}%</div>`;
  });

  waccList.forEach(w => {
    html += `<div class="heatmap-cell heatmap-head">${w}%</div>`;
    tgList.forEach(t => {
      const r = w / 100;
      const tgRate = t / 100;
      if (r <= tgRate) {
        html += '<div class="heatmap-cell" style="background:#2a2a2a;color:#666">-</div>';
        return;
      }
      let cf = baseCF;
      let pvSum = 0;
      for (let y = 1; y <= n; y++) {
        cf = cf * (1 + g);
        pvSum += cf / Math.pow(1 + r, y);
      }
      const terminalCF = cf * (1 + tgRate);
      const terminalValue = terminalCF / (r - tgRate);
      const terminalPV = terminalValue / Math.pow(1 + r, n);
      const ev = pvSum + terminalPV;

      const min = baseCF * 8;
      const max = baseCF * 30;
      const ratio = Math.min(Math.max((ev - min) / (max - min), 0), 1);
      const rC = Math.round(34 + ratio * 221);
      const gC = Math.round(199 - ratio * 150);
      const bC = Math.round(122 - ratio * 60);
      const color = `rgb(${rC},${gC},${bC})`;

      html += `<div class="heatmap-cell" style="background:${color}">${Math.round(ev)}</div>`;
    });
  });
  html += '</div></div>';
  return html;
}

/* ============ 公式推导面板 ============ */
function renderFormulaPanel(steps) {
  return `
    <div class="formula-panel">
      <h3 class="formula-panel-title">📐 公式推导</h3>
      ${steps.map(s => `
        <div class="formula-step">
          <div class="fs-label">${s.label}</div>
          <div class="fs-formula">${s.formula}</div>
          ${s.result ? `<div class="fs-result">= ${s.result}</div>` : ''}
        </div>
      `).join('')}
    </div>
  `;
}