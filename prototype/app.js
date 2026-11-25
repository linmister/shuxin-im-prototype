const { createApp, computed, nextTick, onMounted, reactive, ref } = Vue;
const appVersion = 'v4.5.7';

const tabs = [
  { page: 'messages', label: '聊天', icon: 'MessageCircle' },
  { page: 'contacts', label: '联系人', icon: 'ContactRound' },
  { page: 'group', label: '国家数据集团', icon: 'Landmark' },
  { page: 'check-in', label: '签到', icon: 'CalendarCheck2' },
  { page: 'profile', label: '我的', icon: 'UserRound' },
];

const mediaCategories = {
  'chat-photos': { name: '照片和视频', icon: 'Image', kinds: ['picture', 'image'] },
  'chat-files': { name: '文件', icon: 'FileText', kinds: ['file'] },
  'chat-links': { name: '链接', icon: 'Paperclip', kinds: ['text'] },
  'chat-voice': { name: '语音消息', icon: 'Mic', kinds: ['voice'] },
};
const mediaEntries = Object.entries(mediaCategories);

const titles = {
  login: '登录', register: '注册', messages: '聊天', contacts: '联系人',
  'login-network': '网络线路', 'account-recovery': '找回账号密码', 'recovery-support': '客服',
  'user-agreement': '用户协议', 'privacy-policy': '隐私政策',
  group: '国家数据集团', 'check-in': '签到', profile: '我的',
  chat: '聊天', contact: '个人信息', groups: '群组', requests: '新的朋友', 'add-friend': '搜索',
  promo: '宣传片', news: '新闻资料', 'check-records': '积分明细', 'check-rule': '签到规则',
  'profile-edit': '编辑资料', wallet: '钱包', 'wallet-records': '资金明细', 'subsidy-wallet': '全民补贴钱包', withdraw: '提现方式', alipay: '支付宝',
  invite: '我的邀请码', meeting: '会议', 'password-menu': '修改密码', password: '修改密码',
  'pay-password': '修改支付密码', settings: '通知 · 设备 · 网络', notifications: '通知', network: '网络', device: '设备',
  support: '客服', 'chat-tools': '更多', 'chat-history': '搜索',
  'send-red': '发红包', 'invited-people': '我邀请的人', 'forward-message': '转发到...',
  'withdraw-request': '提现', 'withdraw-account': '提现方式',
  'meeting-create': '预约会议', 'meeting-detail': '会议详情', 'meeting-room': '会议', call: '语音通话',
  'group-info': '群组信息', 'group-announcements': '群公告', 'group-edit': '编辑群组',
  'points-shop': '积分商城', 'lucky-draw': '幸运抽奖', identity: '实名认证',
  'shop-product': '商品详情', 'shop-orders': '兑换记录', 'shop-order': '兑换详情', 'draw-records': '抽奖记录',
  ...Object.fromEntries(mediaEntries.map(([key, category]) => [key, category.name])),
  stickers: '贴纸和表情', scan: '扫描二维码', discover: '发现', square: '广场',
  'native-check': '签到', 'saved-messages': '收藏', 'profile-qr': '二维码', 'sticker-store': '表情商店',
  'square-post': '发布动态', 'square-search': '搜索', 'square-notices': '动态通知',
};
const settingsTabs = ['notifications', 'device', 'network'];
const notificationGroups = [
  { title: '消息通知', options: [
    ['private', '私聊消息'], ['group', '群组消息'], ['channel', '频道消息'], ['activity', '动态通知', '点赞、评论、回复通知'],
  ] },
  { title: '通知内容', options: [['preview', '显示消息预览', '在通知中显示消息内容']] },
  { title: '声音和振动', options: [['sound', '通知声音'], ['tone', '提示音'], ['activitySound', '动态声音', '点赞、评论时播放声音'], ['vibration', '振动']] },
  { title: '应用内通知', options: [['inAppSound', '应用内声音'], ['inAppVibration', '应用内振动']] },
];
const notificationDefaults = Object.fromEntries(notificationGroups.flatMap(group => group.options.filter(([key]) => key !== 'tone').map(([key]) => [key, true])));
const stickerPacks = [
  { name: '动态笑脸', glyph: '😄', count: 48 }, { name: '动态动物', glyph: '🐱', count: 22 },
  { name: '动态自然', glyph: '🌈', count: 5 }, { name: '动态手势', glyph: '👍', count: 17 },
  { name: '动态爱心', glyph: '❤️', count: 18 },
];
const profileLinks = [
  ['meeting', 'Video'], ['wallet', 'Wallet', '钱包余额'],
  ['withdraw', 'CreditCard'], ['identity', 'ShieldCheck'], ['invite', 'Ticket'],
  ['password-menu', 'KeyRound'], ['settings', 'Settings', '通知·网络·设备'], ['stickers', 'Smile'],
].map(([page, icon, label]) => ({ page, icon, title: label ?? titles[page] }));

const seedPeople = [
  { id: 'product', name: '产品协作群', avatar: '群', group: true, color: 'violet', time: '09:40', unread: 3, pinned: true },
  { id: 'lin', name: '林晓', avatar: '林', letter: 'L', tone: 'blue', time: '09:28', unread: 1 },
  { id: 'project', name: '项目讨论组', avatar: '群', group: true, color: 'teal', time: '09:12' },
  { id: 'zhou', name: '周宁', avatar: '周', letter: 'Z', color: 'teal', time: '昨天' },
  { id: 'design', name: '设计评审群', avatar: '群', group: true, color: 'lilac', time: '昨天' },
  { id: 'chen', name: '陈晨', avatar: '陈', letter: 'C', color: 'violet', time: '昨天' },
  { id: 'zhao', name: '赵敏', avatar: '赵', letter: 'Z', color: 'sand', time: '周日' },
  { id: 'xu', name: '许航', avatar: '许', letter: 'X', color: 'teal', time: '周日' },
  { id: 'group-guest', name: '苏禾', avatar: '苏', color: 'blue', time: '' },
];
const support = { id: 'support', name: '联系客服', avatar: '客', time: '09:41' };
const addCandidate = { id: 'wang', name: '王婷', avatar: '王', color: 'lilac', time: '' };
const news = [
  { id: 'example', title: '国家数据局与国家数据集团举行工作会谈', image: './assets/news-2.webp', date: '2026-11-20', source: '国家数据局',
    url: 'https://www.nda.gov.cn/sjj/jgsz/jld/llh/llhldhd/1120/20261120222113664893159_mobile.html',
    body: '11月18日，国家数据局与国家数据集团在北京会谈。会谈明确，集团将围绕数据资源开发利用、数据科技创新和数据基础设施建设布局，双方将建立常态化工作对接机制。' },
  { id: 'exchange', title: '国家数据局部署第二批可信数据空间试点', image: './assets/news-3.webp', date: '2026-11-18', source: '国家数据局',
    url: 'https://www.nda.gov.cn/sjj/zwgk/tzgg/1118/20261118203149832876736_pc.html',
    body: '国家数据局综合司发布试点通知，面向企业、行业和城市三个层面开展工作。试点聚焦数据安全流通、供需协作和应用落地，并探索可信数据空间与人工智能结合的场景。' },
  { id: 'infrastructure', title: '国家数据集团在河北雄安新区成立', image: './assets/news-1.webp', date: '2026-10-20', source: '新华社 · 国家数据局转载',
    url: 'https://www.nda.gov.cn/sjj/swdt/mtsy/1020/20261020191823470535612_mobile.html',
    body: '10月20日，国家数据集团有限公司在河北雄安新区成立，总部也设在雄安新区。集团以数据资源开发利用为主责主业，将通过央地联动和产业合作，促进数据资源利用并服务人工智能和数据产业发展。' },
];
const week = ['日', '一', '二', '三', '四', '五', '六'];
const demoToday = '2026-11-24';
const walletRecordLabels = { 'red-sent': '发出红包', 'red-received': '领取红包', withdrawal: '提现' };
function checkDate(day, offset = 0) {
  const date = new Date(day + 'T00:00:00Z');
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
}
let messageId = 0;
const walletEntry = (kind, cents, date = demoToday, status = '') => ({ id: ++messageId, kind, cents, date, status });
const item = (text, mine = false, kind = 'text', extra = {}) => ({ id: ++messageId, text, mine, kind, ...extra });
const fileSample = () => item('评审资料目录.pdf', false, 'file', {
  size: 'PDF',
  url: './assets/review-sample.pdf',
});

function readRoute() {
  const [page = '', key = ''] = location.hash.slice(1).split('/');
  if (page === 'invite-friend' || page === 'invite-link') return { page: 'invite', key: '' };
  if (page === 'red-records') return { page: 'wallet-records', key: '' };
  if (settingsTabs.includes(page)) return { page: 'settings', key: page };
  return Object.hasOwn(titles, page) ? { page, key } : { page: 'login', key: '' };
}

const AppIcon = {
  props: { name: { type: String, required: true } },
  computed: {
    markup() {
      return (window.SHUXIN_ICONS[this.name] ?? []).map(([tag, attributes]) => {
        const props = Object.entries(attributes).map(([key, value]) => key + '="' + value + '"').join(' ');
        return '<' + tag + ' ' + props + '></' + tag + '>';
      }).join('');
    },
  },
  template: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="markup"></svg>',
};

const AuthAgreement = {
  props: { modelValue: Boolean, page: String },
  emits: ['update:modelValue', 'open-document'],
  template: `<div class="auth-agreement">
    <input :id="page + '-agreement'" type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)">
    <div><label :for="page + '-agreement'">我已阅读并同意</label>
      <button type="button" @click="$emit('open-document', 'user-agreement')">《用户协议》</button>
      和
      <button type="button" @click="$emit('open-document', 'privacy-policy')">《隐私政策》</button>
    </div>
  </div>`,
};

const authDocuments = {
  'user-agreement': [
    { heading: '一、服务条款的接受', text: '在使用本应用前，请您仔细阅读本协议的全部内容。如果您不同意本协议的任何条款，请不要使用本应用。使用本应用即表示您同意接受本协议的所有条款。' },
    { heading: '二、用户账号', items: ['您需要注册账号才能使用本应用的全部功能', '您应当妥善保管账号信息，对账号下的所有行为负责', '禁止将账号转让、出售给他人使用'] },
    { heading: '三、用户行为规范', text: '在使用本应用时，您承诺：', items: ['不发布违法、有害、威胁、辱骂、骚扰、诽谤、侵权内容', '不发布垃圾信息或广告', '不进行任何可能损害本应用正常运营的行为', '遵守中华人民共和国相关法律法规'] },
    { heading: '四、知识产权', text: '本应用的所有内容，包括但不限于文字、图片、软件、音频、视频等，均受著作权法保护。未经许可，不得复制、修改、传播。' },
    { heading: '五、免责声明', items: ['本应用按“现状”提供服务，不提供任何明示或暗示的担保', '对于用户发布的内容，本应用不承担任何责任', '因不可抗力导致的服务中断，本应用不承担责任'] },
    { heading: '六、协议修改', text: '我们保留随时修改本协议的权利。修改后的协议一经发布即生效。' },
    { heading: '七、联系我们', text: '如有任何问题，请通过应用内的反馈功能联系我们。' },
  ],
  'privacy-policy': [
    { text: '本隐私政策说明我们如何收集、使用和保护您的个人信息。' },
    { heading: '一、信息收集', text: '我们可能收集以下类型的信息：' },
    { heading: '1. 账号信息', subheading: true, items: ['用户名、昵称', '头像', '个人简介'] },
    { heading: '2. 设备信息', subheading: true, items: ['设备型号', '操作系统版本', '设备标识符'] },
    { heading: '3. 使用信息', subheading: true, items: ['登录时间', '功能使用情况'] },
    { heading: '4. 通讯内容', subheading: true, items: ['您发送的消息（端对端加密传输）', '分享的媒体文件'] },
    { heading: '二、信息使用', text: '我们使用收集的信息用于：', items: ['提供、维护和改进服务', '发送通知和更新', '保障账号安全', '遵守法律法规要求'] },
    { heading: '三、信息保护', text: '我们采取以下措施保护您的信息：', items: ['使用加密技术保护数据传输', '限制员工访问用户数据的权限', '定期审查安全措施'] },
    { heading: '四、信息共享', text: '除以下情况外，我们不会与第三方共享您的个人信息：', items: ['经您明确同意', '法律法规要求', '保护我们或他人的权益'] },
    { heading: '五、您的权利', text: '您有权：', items: ['访问您的个人信息', '更正不准确的信息', '删除您的账号和数据', '撤回同意'] },
    { heading: '六、Cookie 和类似技术', text: '我们可能使用 Cookie 来改善用户体验和分析使用情况。' },
    { heading: '七、未成年人保护', text: '本应用不面向未满 14 周岁的儿童。如果您是未成年人，请在监护人指导下使用本应用。' },
    { heading: '八、隐私政策更新', text: '我们可能不时更新本隐私政策。重大变更时，我们会通过应用内通知您。' },
    { heading: '九、联系我们', text: '如对本隐私政策有任何疑问，请通过应用内的反馈功能联系我们。' },
    { text: '最后更新日期：2024年1月' },
  ],
};

const longRewards = new Map([[30, 100], [60, 500], [90, 1000], [180, 3000], [360, 10000]]);
const dailyPoints = days => Math.min(35, 5 + days);
const CheckRules = {
  setup: () => ({ milestones: [...longRewards] }),
  template: `<article class="article check-rules">
    <p>每日基础奖励 5 积分。每连续签到 1 天增加 1 积分，连续签到 1 天得 6 积分、2 天得 7 积分，30 天得 35 积分。每日签到奖励最高 35 积分。</p>
    <h2 class="rule-heading">长期签到奖励</h2>
    <div v-for="[days, points] in milestones" :key="days" class="rule-tier"><span>连续签到满 {{ days }} 天</span><strong>+{{ points.toLocaleString('zh-CN') }} 积分</strong></div>
    <p>长期奖励每个档位一次性发放，与当日签到奖励分别计算。</p>
    <p>每位用户每日仅限签到一次。中途漏签，连续签到次数重新计算。</p>
    <p>积分可用于数信商城兑换。数信 IM 签到所得积分与国家数据集团积分不互通。</p>
  </article>`,
};

createApp({
  components: { AppIcon, AuthAgreement, CheckRules },
  setup() {
    const route = ref(readRoute());
    const scenario = new URLSearchParams(location.search);
    const beneficiaryField = { key: 'beneficiary', label: '姓名' };
    const phonePayoutFields = [beneficiaryField, { key: 'phone', label: '手机号', inputmode: 'tel' }];
    const payoutMethods = [
      { id: 'alipay', label: '支付宝', fields: [
        ...phonePayoutFields, { key: 'account', label: '支付宝账号' },
      ] },
      { id: 'bank', label: '银行卡', fields: [
        beneficiaryField,
        { key: 'bank', label: '银行' },
        { key: 'account', label: '卡号', inputmode: 'numeric' },
      ] },
      { id: 'fenxiang', label: '纷享生活', fields: [
        ...phonePayoutFields, { key: 'account', label: '卡号', inputmode: 'numeric' },
      ] },
    ];
    const inviteRequired = scenario.get('invite') !== 'optional';
    const inviteLabel = inviteRequired ? '邀请码（必填）' : '邀请码（选填）';
    const demoInviteCode = 'SX2026';
    let failNextSend = scenario.get('send') === 'fail-once';
    let showIncomingCall = scenario.get('call') === 'incoming';
    const page = computed(() => route.value.page);
    const isTab = computed(() => tabs.some(tab => tab.page === page.value));
    const isAuth = computed(() => page.value === 'login' || page.value === 'register');
    const people = reactive(seedPeople.map(person => ({ ...person })));
    const groupDetails = reactive({
      product: { owner: 'chen', members: ['chen', 'lin', 'xu', 'group-guest', 'self'], admins: ['lin'], announcement: '请在群里同步本周评审进度。', muted: false },
      project: { owner: 'zhou', members: ['zhou', 'chen', 'zhao', 'self'], admins: [], announcement: '', muted: false },
      design: { owner: 'self', members: ['self', 'zhao', 'lin'], admins: [], announcement: '', muted: false },
    });
    const groupDraft = reactive({ name: '', memberIds: [], visibility: '私密', search: '', avatar: '' });
    const groupAvatarInput = ref(null);
    const memberSearch = ref('');
    const memberSearchVisible = ref(false);
    function toggleMemberSearch() {
      memberSearchVisible.value = !memberSearchVisible.value;
      if (!memberSearchVisible.value) memberSearch.value = '';
    }
    const announcementDraft = ref('');
    const memberDraft = reactive({ search: '', ids: [] });
    const memberToManage = ref(null);
    const groupNameDraft = ref('');
    let groupSequence = 0;
    const requests = reactive([{ person: { id: 'luo', name: '罗欣', avatar: '罗', letter: 'L', color: 'lilac', time: '' }, status: 'pending' }]);
    const threads = reactive({
      product: [
        item('09:32', false, 'time'), item('新版页面已经同步。', false, 'text', { sender: '林晓', time: '09:32' }),
        item('群红包', false, 'red', { cents: 300, count: 3, receivedCents: 100, sender: '陈晨', time: '09:36', note: '辛苦了，一起加油！', claims: [{ name: '周宁', cents: 85 }] }),
        item('新版页面已更新，大家有空看一下。', false, 'text', { sender: '陈晨', time: '09:40' }),
      ],
      lin: [
        item('09:06', false, 'time'), item('评审时间定在下午三点。', true), item('好，我先整理一下资料。'),
        item('09:19', false, 'time'), item('下午的评审资料整理好了吗？', true),
        item('大部分整理好了，我再核对一遍。'), item('我把目录先发你看一下。'), fileSample(),
        item('我看过目录了，按这个版本发吧。', true, 'text', { time: '09:26', delivery: 'read' }), item('09:28', false, 'time'),
        item('红包', false, 'red', { direct: true, cents: 200, count: 1, sender: '林晓', time: '09:28', note: '辛苦了！', claims: [] }),
        item('收到，我下午把资料发给你。'),
      ],
      project: [item('会议纪要.pdf', false, 'file', { sender: '周宁', time: '09:12', size: 'PDF', url: './assets/review-sample.pdf' })],
      zhou: [item('好的，明天见。')],
      design: [item('第二版设计稿已经上传。', false, 'text', { sender: '赵敏', time: '18:04' })],
      chen: [item('我先确认一下时间。')],
      zhao: [item('谢谢，已经收到。')],
      xu: [item('我把链接发到群里了。')],
      support: [item('你好，有什么可以帮你？')],
    });
    const activePerson = computed(() => people.find(person => person.id === route.value.key) ??
      (route.value.key === support.id ? support : people.find(person => person.id === 'lin')));
    const activeMessages = computed(() => threads[activePerson.value.id] ?? []);
    const canSendRed = computed(() => activePerson.value.id === route.value.key && Boolean(activePerson.value.group || activePerson.value.letter));
    const currentGroup = computed(() => groupDetails[route.value.key]);
    const isGroupOwner = computed(() => currentGroup.value?.owner === 'self');
    const isGroupParticipant = computed(() => currentGroup.value?.members.includes('self') ?? false);
    const groupRoster = computed(() => (currentGroup.value?.members ?? []).map(id => {
      const person = id === 'self' ? { id, name: profile.nickname, avatar: profile.nickname[0] } : people.find(p => p.id === id);
      const role = id === currentGroup.value.owner ? '群主' : currentGroup.value.admins.includes(id) ? '管理员' : '成员';
      return person ? { ...person, role } : null;
    }).filter(person => {
      if (!person) return false;
      const query = memberSearch.value.trim().toLowerCase();
      return person.name.toLowerCase().includes(query) || (person.username ?? person.id).toLowerCase().includes(query);
    }));
    const groupCandidates = computed(() => people.filter(person => person.letter));
    const filteredGroupCandidates = computed(() => groupCandidates.value.filter(person => person.name.includes(groupDraft.search)));
    const availableGroupContacts = computed(() => groupCandidates.value.filter(person => !currentGroup.value?.members.includes(person.id)));
    const matchingGroupContacts = computed(() => availableGroupContacts.value.filter(person => person.name.includes(memberDraft.search.trim())));
    const managedMember = computed(() => people.find(person => person.id === memberToManage.value));
    const managedIsAdmin = computed(() => Boolean(currentGroup.value?.admins.includes(memberToManage.value)));
    const activeNews = computed(() => news.find(entry => entry.id === route.value.key) ?? news[0]);
    const title = computed(() => {
      if (page.value === 'chat') return activePerson.value.name;
      if (page.value === 'send-red' && activePerson.value.group) return '发群红包';
      if (page.value === 'call' && activeCall.value) return activeCall.value.type === 'video' ? '视频通话' : '语音通话';
      if (page.value === 'withdraw-account' && accountMethod.value) return accountMethod.value.label;
      if (page.value === 'pay-password' && !payConfigured.value) return '设置支付密码';
      return titles[page.value];
    });
    const foundConversations = computed(() => people.filter(person => {
      if (hiddenConversations.has(person.id) || (!threads[person.id]?.length && groupDetails[person.id]?.owner !== 'self')) return false;
      if (chatFilter.value !== 'all' && Boolean(person.group) !== (chatFilter.value === 'group')) return false;
      const term = search.value.trim();
      return !term || person.name.includes(term) || threads[person.id].some(message => message.text.includes(term));
    }).sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) || (b.activity ?? 0)-(a.activity ?? 0)));
    const contactSections = computed(() => {
      const buckets = {};
      for (const person of people) {
        if (!person.letter || !person.name.includes(search.value.trim())) continue;
        (buckets[person.letter] ??= []).push(person);
      }
      return Object.entries(buckets).sort(([a], [b]) => a.localeCompare(b))
        .map(([letter, people]) => ({ letter, people }));
    });

    const search = ref('');
    const chatFilter = ref('all');
    const chatSelecting = ref(false);
    const selectedChats = reactive(new Set());
    const hiddenConversations = reactive(new Set());
    const conversationTarget = ref(null);
    const visibleChatsSelected = computed(() => !!foundConversations.value.length && foundConversations.value.every(person => selectedChats.has(person.id)));
    function toggleChatSelection() {
      chatSelecting.value = !chatSelecting.value;
      selectedChats.clear();
    }
    function toggleSelectedChat(id) {
      if (selectedChats.has(id)) selectedChats.delete(id);
      else selectedChats.add(id);
    }
    function selectAllChats() {
      const selected = visibleChatsSelected.value;
      for (const person of foundConversations.value) {
        if (selected) selectedChats.delete(person.id);
        else selectedChats.add(person.id);
      }
    }
    function applyChatBatch(remove) {
      for (const person of people.filter(person => selectedChats.has(person.id))) {
        person.unread = 0;
        if (remove) hiddenConversations.add(person.id);
      }
      modal.value = '';
      toggleChatSelection();
    }
    function conversationMuted(person) {
      return person.group ? !!groupDetails[person.id]?.muted : !!contactMuted[person.id];
    }
    function showConversationMenu(person) {
      cancelMessagePress();
      if (chatSelecting.value) return;
      conversationTarget.value = person;
      modal.value = 'conversation-menu';
    }
    function toggleConversationMute() {
      const person = conversationTarget.value;
      if (person.group) groupDetails[person.id].muted = !conversationMuted(person);
      else contactMuted[person.id] = !conversationMuted(person);
      modal.value = '';
    }
    function removeConversation() {
      const person = conversationTarget.value;
      if (!person) return;
      person.unread = 0;
      hiddenConversations.add(person.id);
      modal.value = '';
    }
    const favorites = ref([]);
    const currentMedia = computed(() => mediaCategories[page.value]);
    const contactRemarks = reactive({});
    const contactMuted = reactive({});
    const sharedGroups = computed(() => people.filter(person => person.group &&
      groupDetails[person.id]?.members.includes(activePerson.value.id)));
    function conversationMediaItems(mediaPage) {
      return activeMessages.value.filter(message =>
        mediaCategories[mediaPage].kinds.includes(message.kind) && (mediaPage !== 'chat-links' || /https?:\/\//.test(message.text)));
    }
    const historySearch = ref('');
    const newFriendSearch = ref('');
    const newFriendQuery = ref('');
    const userSearchResults = computed(() => {
      const term = newFriendQuery.value;
      if (!term) return [];
      const candidates = people.some(person => person.id === addCandidate.id) ? people : [...people, addCandidate];
      return candidates.filter(person => person.name.includes(term) || person.id === term);
    });
    function searchUsers() {
      newFriendQuery.value = newFriendSearch.value.trim();
    }
    function chatWithSearchResult(person) {
      if (!people.some(candidate => candidate.id === person.id)) people.push({ ...person, letter: '' });
      if (person.group || person.letter) enterChat(person.id);
      else open('contact', person.id);
    }
    const draft = ref('');
    const composerInput = ref(null);
    const replyContext = ref(null);
    const editingMessage = ref(null);
    let draftBeforeEdit = '';
    const chatPanel = ref('');
    const surface = ref(null);
    const fileInput = ref(null);
    const pendingByChat = reactive({});
    const pendingPictures = computed(() => pendingByChat[activePerson.value.id] ?? []);
    const picturePreview = ref(null);
    const sendOriginal = ref(false);
    const picturesBusy = ref(false);
    let fileMode;
    let fileOwner;
    const voiceMode = ref(false);
    const voiceStarted = ref(null);
    const voiceElapsed = ref('00:00');
    let voiceTimer;
    const playingVoiceId = ref(null);
    let voiceOrigin;
    let voicePlayer;
    const modal = ref('');
    const notice = ref('');
    const activeAttachment = ref(null);
    const selectedRed = ref(null);
    const redDraft = reactive({ amount: '', count: '', note: '' });
    const redError = ref('');
    const currentMessage = ref(null);
    const quickReactions = [['👍', '赞'], ['❤️', '爱心'], ['😂', '笑哭'], ['😮', '惊讶'], ['😟', '担心'], ['🙏', '感谢']];
    const reactionChoices = [...quickReactions, ['👋', '挥手'], ['😄', '开心'], ['😎', '酷'], ['🤔', '思考'], ['🔥', '火'], ['🎉', '庆祝'], ['😍', '喜欢'], ['✨', '闪亮'], ['👏', '鼓掌'], ['🐱', '猫']];
    const reactionPickerOpen = ref(false);
    const reactionSearch = ref('');
    const recentReactions = ref([]);
    const visibleReactions = computed(() => reactionChoices.filter(([glyph, label]) => `${glyph} ${label}`.includes(reactionSearch.value.trim())));
    const selectingMessages = ref(false);
    const selectedMessageIds = reactive(new Set());
    const messagesToForward = ref([]);
    const selectableMessages = computed(() => activeMessages.value.filter(message => message.kind !== 'time'));
    const allMessagesSelected = computed(() => !!selectableMessages.value.length && selectableMessages.value.length === selectedMessageIds.size);
    const activeCall = ref(null);
    const callElapsed = ref(0);
    let callAnswerTimer;
    let callClock;
    const callDuration = computed(() => formatCallDuration(callElapsed.value));
    const forwardTargets = computed(() => people.filter(person => person.id !== activePerson.value.id && threads[person.id]?.length));
    const avatarInput = ref(null);
    const avatarPreview = ref('');
    let pressTimer;
    let pressOrigin;
    const dialogTitle = computed(() => ({
      logout: '确定要退出登录吗？', 'open-red': '领取红包', 'receive-red': '红包详情', 'leave-meeting': '确定退出会议吗？',
      'redeem-points': '确认兑换', 'draw-result': '抽奖结果',
      attachment: activeAttachment.value?.text, 'message-menu': currentMessage.value?.text,
      'conversation-menu': '会话操作', 'remove-conversation': '删除 1 个聊天？',
      'delete-message': `删除 ${selectedMessageIds.size} 条消息`, 'avatar-source': '头像', 'avatar-crop': '裁剪头像',
      'withdraw-method': '请选择提现方式', 'withdraw-account-required': '请补充提现信息', 'withdraw-success': '提现申请已提交', 'join-meeting': '加入会议',
      'end-meeting': '确认结束当前会议吗？',
      'reset-notifications': '重置所有通知设置',
      'end-other-devices': '确定要终止所有其他设备的会话吗？这将使其他设备上的登录失效。',
      'end-device': '确定要终止该设备的会话吗？',
      'check-rule': '签到规则',
      'picture-preview': '预览',
      'create-group': '新建群组', 'leave-group': '退出「' + activePerson.value.name + '」？',
      'add-group-members': '添加成员', 'group-member-actions': managedMember.value?.name,
      'remove-group-member': '移除成员',
      'batch-remove': `删除 ${selectedChats.size} 个聊天？`, 'chat-actions': '更多', 'subsidy-rules': '签到规则',
      'meeting-duration': '选择会议时长', 'meeting-start': '选择开始时间',
      'notification-tone': '选择提示音', 'change-password': '修改密码',
      'edit-nickname': '修改昵称',
      'square-audience': '谁可以看', 'square-audience-people': '选择可见的人',
      'square-emoji': '表情', 'square-topic': '话题', 'square-mention': '@',
      'shared-groups': '共同群组',
    })[modal.value] ?? '');
    const historyResults = computed(() => activeMessages.value.filter(message =>
      message.kind !== 'time' && message.text.includes(historySearch.value.trim())));
    const emojis = ['😀', '👍', '🎉', '❤️', '🙌', '😄', '🤝', '😊'];
    let noticeTimer;
    let activity = 0;

    function setNotice(value) {
      notice.value = value;
      clearTimeout(noticeTimer);
      noticeTimer = setTimeout(() => { notice.value = ''; }, 2100);
    }

    function scrollChat() {
      nextTick(() => {
        if (page.value === 'chat' && surface.value) surface.value.scrollTop = surface.value.scrollHeight;
      });
    }

    function applyRoute(value, listState) {
      const missingGroup = ['group-info', 'group-announcements', 'group-edit'].includes(value.page) && !groupDetails[value.key];
      const missingChat = value.page === 'chat' && value.key !== support.id &&
        !people.some(person => person.id === value.key);
      const missingMediaOwner = Object.hasOwn(mediaCategories, value.page) && !people.some(person => person.id === value.key);
      if (missingGroup || missingChat || missingMediaOwner) {
        value = { page: 'messages', key: '' };
        history.replaceState({ depth: 0 }, '', '#messages');
      }
      cancelMessagePress();
      if (!['chat', 'forward-message'].includes(value.page) || value.key !== route.value.key) exitMessageSelection();
      if (value.page !== 'forward-message') messagesToForward.value = [];
      if (value.page !== 'chat' || value.key !== route.value.key) clearMessageComposer();
      if (value.page === 'chat' && route.value.page === 'chat' && value.key !== route.value.key) draft.value = '';
      stopVoiceCapture(false);
      stopVoicePlayback();
      voiceMode.value = false;
      if (route.value.page === 'call' && value.page !== 'call') {
        const phase = activeCall.value?.phase;
        if (phase) recordCall(phase === 'incoming' ? '未接听' : phase === 'connected' ? '通话结束' : '呼叫已取消');
      }
      if (route.value.page !== value.page || listState) search.value = listState?.search ?? '';
      if (value.page === 'settings' && route.value.page !== 'settings') settingsSection.value = value.key || 'notifications';
      if (value.page !== 'messages' && chatSelecting.value) toggleChatSelection();
      if (route.value.page === 'identity' && value.page !== 'identity') clearIdentityDraft();
      route.value = value;
      if (value.page === 'alipay' || value.page === 'withdraw-account') {
        accountDraft.value = { ...boundAccounts[accountMethod.value?.id] };
      } else {
        pendingPayout.value = null;
      }
      modal.value = '';
      chatPanel.value = '';
      historySearch.value = '';
      newFriendSearch.value = '';
      newFriendQuery.value = '';
      memberSearch.value = listState?.memberSearch ?? '';
      memberSearchVisible.value = listState?.memberSearchVisible ?? false;
      nextTick(() => {
        if (surface.value && page.value === value.page && page.value !== 'chat') {
          surface.value.scrollTop = listState?.scroll ?? 0;
        }
        scrollChat();
      });
    }

    function open(nextPage, key = '', replace = false) {
      const value = { page: nextPage, key };
      const hash = '#' + nextPage + (key ? '/' + key : '');
      if (location.hash !== hash) {
        const depth = replace ? 0 : (history.state?.depth ?? 0) + 1;
        const openingMedia = Object.hasOwn(mediaCategories, nextPage) && ['group-info', 'contact'].includes(page.value);
        if (!replace && (['messages', 'contacts'].includes(page.value) || openingMedia)) {
          const listState = { search: search.value, scroll: surface.value?.scrollTop ?? 0 };
          if (openingMedia) Object.assign(listState, { memberSearch: memberSearch.value, memberSearchVisible: memberSearchVisible.value });
          history.replaceState({ ...history.state, listState }, '', location.href);
        }
        history[replace ? 'replaceState' : 'pushState']({ depth }, '', hash);
      }
      applyRoute(value);
    }

    function switchTab(nextPage) {
      if (page.value !== nextPage) open(nextPage, '', true);
    }

    function back(fallback = 'messages') {
      if (modal.value) {
        modal.value = '';
      } else if (history.state?.depth > 0) {
        history.back();
      } else if (currentMedia.value) {
        open(activePerson.value.group ? 'group-info' : 'contact', activePerson.value.id, true);
      } else {
        open(typeof fallback === 'string' ? fallback : 'messages', '', true);
      }
    }

    const parentPages = {
      wallet: 'profile', withdraw: 'profile', 'withdraw-request': 'wallet',
      'wallet-records': 'wallet', 'subsidy-wallet': 'wallet', settings: 'profile', 'native-check': 'profile',
      invite: 'profile', 'invited-people': 'invite', 'shop-order': 'shop-orders',
      'shop-orders': 'points-shop', 'draw-records': 'lucky-draw', 'sticker-store': 'stickers', square: 'discover',
      'square-search': 'square', 'square-notices': 'square', 'square-post': 'square',
      'login-network': 'login', 'account-recovery': 'login', 'recovery-support': 'account-recovery',
      'user-agreement': 'login', 'privacy-policy': 'login',
    };

    const loginCodes = ['6147', '3852', '9274', '5138'];
    const loginCaptchaIndex = ref(0);
    const loginCaptcha = computed(() => loginCodes[loginCaptchaIndex.value]);
    const auth = reactive({ account: '13800000000', password: 'demo1234', code: loginCodes[0], agreement: true });
    const demoCredential = reactive({ account: '13800000000', password: 'demo1234', changed: false });
    const loginError = ref('');
    const signup = reactive({ phone: '', password: '', confirm: '', nickname: '', invite: scenario.get('inviteCode') === demoInviteCode ? demoInviteCode : '', code: '', agreement: false, avatar: '' });
    const signupAvatarInput = ref(null);
    const showPassword = ref(false);
    const showSignupPassword = ref(false);
    const showSignupConfirm = ref(false);
    const registerError = ref('');
    const codes = ['5036', '8621', '4792', '3510'];
    const captchaIndex = ref(0);
    const captcha = computed(() => codes[captchaIndex.value]);
    const profile = reactive({ nickname: '沈悦', username: '13800000000', phone: '+86 138****0000', bio: '', avatar: '', gender: '', birthday: '' });
    const profileDraft = reactive({ nickname: '', bio: '', gender: '', birthday: '' });
    const nicknameDraft = ref('');
    const nicknameInput = ref(null);
    const savedLocalNickname = ref('');
    const boundAccounts = reactive({});
    const accountDraft = ref({});
    const accountMethod = computed(() => payoutMethods.find(method => method.id === (page.value === 'alipay' ? 'alipay' : route.value.key)));
    const walletRecords = ref([
      walletEntry('withdrawal', -800, checkDate(demoToday, -1), '审核中'),
      walletEntry('red-sent', -450, checkDate(demoToday, -2)),
      walletEntry('red-received', 1250, checkDate(demoToday, -3)),
    ]);
    const walletRecordKind = ref('all');
    const shownWalletRecords = computed(() => walletRecordKind.value === 'all'
      ? walletRecords.value
      : walletRecords.value.filter(record => record.kind === walletRecordKind.value));
    const availableCents = computed(() => walletRecords.value.reduce((balance, record) => balance + record.cents, 8650));
    const walletBalance = computed(() => (availableCents.value / 100).toFixed(2));
    const withdrawDraft = reactive({ amount: '', method: '' });
    const pendingPayout = ref(null);
    const selectedPayout = computed(() => payoutMethods.find(method => method.id === withdrawDraft.method));
    const withdrawError = ref('');
    const withdrawReceipt = ref(null);
    const settingsSection = ref(route.value.key && settingsTabs.includes(route.value.key) ? route.value.key : 'notifications');
    const notifications = reactive({ ...notificationDefaults });
    const systemNotificationAllowed = ref(window.Notification?.permission === 'granted');
    async function requestNotifications() {
      if (!window.Notification || Notification.permission === 'denied') {
        setNotice('请在系统设置中允许通知');
        return;
      }
      systemNotificationAllowed.value = (await Notification.requestPermission()) === 'granted';
    }
    const notificationTone = ref('弹钱');
    const notificationTones = { 弹钱: 'coin', 清脆: 'crisp', 无: '' };
    let tonePreview;
    function playTone(tone) {
      tonePreview?.pause();
      const sound = notificationTones[tone];
      if (!sound) return;
      tonePreview = new Audio('./assets/notification-' + sound + '.wav');
      tonePreview.play().catch(() => {});
    }
    const networkLines = ref([{ id: 1, latency: 186 }]);
    const selectedNetwork = ref(1);
    const networkPending = reactive(new Set());
    const online = ref(navigator.onLine !== false);
    const networkAvailableCount = computed(() => online.value
      ? networkLines.value.filter(line => line.latency !== null && !networkPending.has(line.id)).length : 0);
    const selectedLatency = computed(() => {
      if (!online.value || networkPending.has(selectedNetwork.value)) return null;
      return networkLines.value.find(line => line.id === selectedNetwork.value)?.latency ?? null;
    });
    function testNetwork(action = 'retest', lineId = null) {
      if (networkPending.size) return;
      if (action === 'discover') {
        networkLines.value = Array.from({ length: 6 }, (_, index) => ({ id: index + 1, latency: null }));
      }
      const targets = networkLines.value.filter(line => lineId === null || line.id === lineId);
      for (const line of targets) networkPending.add(line.id);
      const samples = [819, 1309, 1800, null, 1350, 1506];
      for (const [index, line] of targets.entries()) {
        setTimeout(() => {
          line.latency = online.value ? samples[line.id - 1] : null;
          networkPending.delete(line.id);
        }, 580 + 90 * index);
      }
    }
    const stickerTab = ref('已安装');
    const stickerStoreTab = ref('商店');
    const stickerStoreSearch = ref('');
    const stickerSettings = reactive({ 发送贴纸时显示动画: true, 自动播放动态贴纸: true, 表情包建议: true });
    const addedStickerPacks = reactive(new Set());
    const customStickers = ref([]);
    const stickerFile = ref(null);
    const arrangingStickers = ref(false);
    const selectedStickers = reactive(new Set());
    function toggleStickerArrangement() {
      arrangingStickers.value = !arrangingStickers.value;
      selectedStickers.clear();
    }
    function toggleStickerSelection(url) {
      if (selectedStickers.has(url)) selectedStickers.delete(url);
      else selectedStickers.add(url);
    }
    function openStickerStore() {
      stickerStoreTab.value = '制作表情';
      arrangingStickers.value = false;
      selectedStickers.clear();
      open('sticker-store');
    }
    function addCustomSticker(event) {
      const [file] = event.target.files;
      event.target.value = '';
      if (!file?.type.startsWith('image/')) return;
      customStickers.value.push({ name: file.name, url: URL.createObjectURL(file) });
    }
    function removeSelectedStickers() {
      for (const url of selectedStickers) URL.revokeObjectURL(url);
      customStickers.value = customStickers.value.filter(sticker => !selectedStickers.has(sticker.url));
      selectedStickers.clear();
    }
    const squareAudiences = [
      ['公开', '所有人都能看到'], ['联系人', '仅你的联系人可见'],
      ['部分可见', '选择可见的人'], ['私密', '仅自己可见'],
    ];
    const squareContacts = computed(() => people.filter(person => person.letter));
    const squareEntries = ref([]);
    const squareQuery = ref('');
    const squareDraft = reactive({ text: '', audience: '公开', attachment: null });
    const squareAudience = reactive(new Set());
    const committedAudience = ref([]);
    const squareUpload = ref(null);
    const squareTopic = ref('');
    function openSquarePost() {
      if (squareDraft.attachment) URL.revokeObjectURL(squareDraft.attachment.url);
      Object.assign(squareDraft, { text: '', audience: '公开', attachment: null });
      committedAudience.value = [];
      open('square-post');
    }
    function pickSquareAudience(audience) {
      if (audience === '部分可见') {
        squareAudience.clear();
        for (const id of committedAudience.value) squareAudience.add(id);
        modal.value = 'square-audience-people';
        return;
      }
      squareDraft.audience = audience;
      modal.value = '';
    }
    function selectSquarePerson(id) {
      if (squareAudience.has(id)) squareAudience.delete(id);
      else squareAudience.add(id);
    }
    function confirmSquareAudience() {
      committedAudience.value = [...squareAudience];
      squareDraft.audience = '部分可见';
      modal.value = '';
    }
    function pickSquareFile(type) {
      const input = squareUpload.value;
      input.accept = type === 'video' ? 'video/*' : 'image/*';
      if (type === 'camera') input.setAttribute('capture', 'environment');
      else input.removeAttribute('capture');
      input.click();
    }
    function attachSquareFile(event) {
      const [file] = event.target.files;
      event.target.value = '';
      if (!file || !/^(image|video)\//.test(file.type)) return;
      if (squareDraft.attachment) URL.revokeObjectURL(squareDraft.attachment.url);
      squareDraft.attachment = { url: URL.createObjectURL(file), video: file.type.startsWith('video/') };
    }
    function publishSquarePost() {
      if (!squareDraft.text.trim() && !squareDraft.attachment) return;
      squareEntries.value.unshift({ ...squareDraft, id: ++messageId, recipients: [...committedAudience.value] });
      squareDraft.attachment = null;
      setNotice('已提交审核');
      back('square');
    }
    const scanImage = ref(null);
    const scanResult = ref('');
    async function decodeScan(event) {
      const [file] = event.target.files;
      event.target.value = '';
      if (!file) return;
      if (!('BarcodeDetector' in window)) {
        scanResult.value = '当前浏览器不支持识别二维码';
        return;
      }
      try {
        const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
        const codes = await detector.detect(file);
        scanResult.value = codes[0]?.rawValue || '未识别到二维码';
      } catch {
        scanResult.value = '未识别到二维码';
      }
    }
    const otherDevices = ref(scenario.get('devices') === 'multiple' ? [
      { id: 'desktop-demo', name: 'Windows', date: '2026-11-24 09:12' },
      { id: 'tablet-demo', name: 'Android 平板', date: '2026-11-23 19:40' },
    ] : []);
    const selectedDevice = ref('');
    const payPassword = ref('');
    const payConfigured = computed(() => Boolean(payPassword.value));
    const passwordDraft = reactive({ old: '', first: '', confirm: '' });
    const passwordError = ref('');
    const passwordMode = ref('password');
    const visiblePasswords = reactive(new Set());
    function openPasswordModal(mode = 'password') {
      passwordMode.value = mode;
      Object.assign(passwordDraft, { old: '', first: '', confirm: '' });
      visiblePasswords.clear();
      passwordError.value = '';
      modal.value = 'change-password';
    }
    function togglePasswordField(field) {
      if (visiblePasswords.has(field)) visiblePasswords.delete(field);
      else visiblePasswords.add(field);
    }
    const meetingCode = ref('');
    const meetingDurations = [30, 60, 90, 120, 150, 180];
    const nextMeetingSlots = computed(() => {
      const interval = 30 * 60 * 1000;
      const first = (Math.floor(Date.now() / interval) + 1) * interval;
      return Array.from({ length: 24 }, (_, index) => first + interval * index);
    });
    function formatMeetingSlot(value) {
      const date = new Date(value);
      const day = date.toDateString() === new Date().toDateString()
        ? '今天' : date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
      return day + ' ' + date.toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' });
    }
    const profileQrGroup = computed(() => groupDetails[route.value.key] ? route.value.key : '');
    const meetingError = ref('');
    const demoMeetingCode = '820156321';
    const meetingRooms = ref([]);
    const meetingDraft = reactive({ subject: '', immediate: true, start: '', duration: 60 });
    const meetingCreateError = ref('');
    const currentMeeting = computed(() => meetingRooms.value.find(room => room.code === route.value.key));
    let roomSequence = 0;

    function login() {
      if (!auth.agreement) {
        loginError.value = '请先阅读并同意用户协议和隐私政策';
        return;
      }
      if (!auth.account) {
        loginError.value = '请输入手机号';
        return;
      }
      if (auth.account.length < 11) {
        loginError.value = '手机号位数至少11位';
        return;
      }
      if (!auth.password) {
        loginError.value = '请输入密码';
        return;
      }
      if (auth.code !== loginCaptcha.value) {
        loginError.value = auth.code ? '请输入正确的验证码' : '请输入验证码';
        return;
      }
      if (auth.account !== demoCredential.account || auth.password !== demoCredential.password) {
        loginError.value = '失败';
        return;
      }
      loginError.value = '';
      if (savedLocalNickname.value) profile.nickname = savedLocalNickname.value;
      auth.password = '';
      showPassword.value = false;
      open('messages', '', true);
    }

    function logout() {
      auth.account = demoCredential.account;
      auth.password = demoCredential.changed ? '' : demoCredential.password;
      auth.code = loginCaptcha.value;
      loginError.value = '';
      draft.value = '';
      open('login', '', true);
    }

    function refreshCaptcha() {
      captchaIndex.value = (captchaIndex.value + 1) % codes.length;
      signup.code = '';
      registerError.value = '';
    }
    function refreshLoginCaptcha() {
      loginCaptchaIndex.value = (loginCaptchaIndex.value + 1) % loginCodes.length;
      auth.code = '';
      loginError.value = '';
    }
    function chooseSignupAvatar(event) {
      const [file] = event.target.files;
      event.target.value = '';
      if (!file?.type.startsWith('image/')) return;
      if (signup.avatar) URL.revokeObjectURL(signup.avatar);
      signup.avatar = URL.createObjectURL(file);
    }

    function register() {
      if (!signup.agreement) {
        registerError.value = '请先阅读并同意用户协议和隐私政策';
        return;
      }
      if (!signup.phone || !signup.nickname || !signup.password || !signup.confirm) {
        registerError.value = !signup.phone ? '请输入手机号' : !signup.nickname ? '请输入昵称' : !signup.password ? '请输入密码' : '请再次输入密码';
        return;
      }
      if (signup.password.length < 6 || signup.password.length > 20) {
        registerError.value = '密码长度为6-20位';
        return;
      }
      if (inviteRequired && !signup.invite) {
        registerError.value = '当前注册必须填写邀请码';
        return;
      }
      if (signup.password !== signup.confirm) {
        registerError.value = '两次输入的密码不一致';
        return;
      }
      if (signup.code.toUpperCase() !== captcha.value) {
        registerError.value = '请输入正确的验证码';
        return;
      }
      if (!/^1\d{10}$/.test(signup.phone)) {
        registerError.value = '注册失败';
        return;
      }
      profile.phone = signup.phone.slice(0, 3) + '****' + signup.phone.slice(-4);
      profile.avatar = signup.avatar;
      savedLocalNickname.value = signup.nickname;
      Object.assign(demoCredential, { account: signup.phone, password: signup.password, changed: true });
      auth.account = signup.phone;
      auth.password = '';
      Object.assign(signup, { phone: '', password: '', confirm: '', nickname: '', invite: '', code: '', agreement: false, avatar: '' });
      showSignupPassword.value = false;
      showSignupConfirm.value = false;
      registerError.value = '';
      back('login');
    }

    function lastMessage(id) {
      const messages = threads[id] ?? [];
      const last = messages.findLast(message => message.kind !== 'time');
      if (!last) return '';
      return !last.mine && last.sender ? last.sender + '：' + last.text : last.text;
    }

    function enterChat(id) {
      if (id !== support.id && !people.some(person => person.id === id)) return;
      if (!threads[id]) threads[id] = [];
      if (id !== activePerson.value.id || page.value !== 'chat') {
        clearMessageComposer();
        draft.value = '';
      }
      const person = people.find(person => person.id === id);
      if (person) person.unread = 0;
      open('chat', id);
      if (showIncomingCall && person && !person.group) {
        showIncomingCall = false;
        startCall('voice', true);
      }
    }
    function openGroupCreation() {
      if (groupDraft.avatar) URL.revokeObjectURL(groupDraft.avatar);
      Object.assign(groupDraft, { name: '', memberIds: [], visibility: '私密', search: '', avatar: '' });
      modal.value = 'create-group';
    }
    function selectGroupAvatar(event) {
      const [file] = event.target.files;
      event.target.value = '';
      if (!file?.type.startsWith('image/')) return;
      if (groupDraft.avatar) URL.revokeObjectURL(groupDraft.avatar);
      groupDraft.avatar = URL.createObjectURL(file);
    }
    function createGroup() {
      const name = groupDraft.name.trim();
      const memberIds = groupDraft.memberIds.filter(id => groupCandidates.value.some(person => person.id === id));
      if (!name || !memberIds.length) return;
      const id = 'new-group-' + ++groupSequence;
      groupDetails[id] = { owner: 'self', members: ['self', ...memberIds], admins: [], announcement: '', muted: false, visibility: groupDraft.visibility };
      people.push({ id, name, avatar: '群', avatarImage: groupDraft.avatar, group: true, color: 'violet', time: '' });
      groupDraft.avatar = '';
      enterChat(id);
      setNotice('群组已创建');
    }
    function openGroupAnnouncements() {
      if (!currentGroup.value) return;
      announcementDraft.value = currentGroup.value.announcement;
      open('group-announcements', activePerson.value.id);
    }
    function saveGroupAnnouncement() {
      const group = currentGroup.value;
      if (group?.owner !== 'self' || !announcementDraft.value.trim()) return;
      const prior = group.announcement;
      group.announcement = announcementDraft.value.trim();
      setNotice(prior ? '公告已更新' : '公告已发布');
    }
    function leaveGroup() {
      if (!currentGroup.value || currentGroup.value.owner === 'self') return;
      const id = activePerson.value.id;
      const index = people.findIndex(person => person.id === id);
      if (index < 0) return;
      people.splice(index, 1);
      delete groupDetails[id];
      open('groups', '', true);
    }
    function openGroupEdit() {
      if (!isGroupOwner.value) return;
      groupNameDraft.value = activePerson.value.name;
      open('group-edit', activePerson.value.id);
    }
    function saveGroupName() {
      if (!isGroupOwner.value || !groupNameDraft.value.trim()) return;
      activePerson.value.name = groupNameDraft.value.trim();
      setNotice('保存成功');
      back('groups');
    }
    function openGroupMemberPicker() {
      if (!isGroupParticipant.value) return;
      Object.assign(memberDraft, { search: '', ids: [] });
      modal.value = 'add-group-members';
    }
    function addGroupMembers() {
      if (!isGroupParticipant.value) return;
      const available = new Set(availableGroupContacts.value.map(person => person.id));
      const ids = [...new Set(memberDraft.ids)].filter(id => available.has(id));
      if (!ids.length) return;
      currentGroup.value.members.push(...ids);
      memberSearch.value = '';
      modal.value = '';
    }
    function openGroupMemberActions(member) {
      if (!isGroupOwner.value || member.id === 'self' || !currentGroup.value.members.includes(member.id)) return;
      memberToManage.value = member.id;
      modal.value = 'group-member-actions';
    }
    function changeGroupMemberRole() {
      if (!isGroupOwner.value || !managedMember.value || !currentGroup.value.members.includes(managedMember.value.id)) return;
      const id = managedMember.value.id;
      const wasAdmin = managedIsAdmin.value;
      if (wasAdmin) currentGroup.value.admins = currentGroup.value.admins.filter(admin => admin !== id);
      else currentGroup.value.admins.push(id);
      modal.value = '';
      setNotice(wasAdmin ? '已取消管理员' : '已设为管理员');
    }
    function removeGroupMember() {
      if (!isGroupOwner.value || !managedMember.value || !currentGroup.value.members.includes(managedMember.value.id)) return;
      const id = managedMember.value.id;
      currentGroup.value.members = currentGroup.value.members.filter(member => member !== id);
      currentGroup.value.admins = currentGroup.value.admins.filter(admin => admin !== id);
      modal.value = '';
    }

    function append(message, person = activePerson.value) {
      hiddenConversations.delete(person.id);
      if (!threads[person.id]) threads[person.id] = [];
      if (message.mine) message.time ??= '09:41';
      threads[person.id].push(message);
      person.time = '09:41';
      person.activity = ++activity;
      scrollChat();
    }

    function sendMessage() {
      const text = draft.value.trim();
      if (!text) return;
      if (editingMessage.value) {
        editingMessage.value.text = text;
        clearMessageComposer();
        return;
      }
      const person = activePerson.value;
      append(item(text, true, 'text', { delivery: 'sending', reply: replyContext.value }), person);
      const message = threads[person.id].at(-1);
      draft.value = '';
      replyContext.value = null;
      chatPanel.value = '';
      deliverMessage(message, person);
    }
    function formatCallDuration(seconds) {
      const pad = number => String(number).padStart(2, '0');
      return pad(Math.floor(seconds / 60)) + ':' + pad(seconds % 60);
    }
    function startCall(type, incoming = false) {
      const person = activePerson.value;
      if (activeCall.value || person.group || person.id === support.id) return;
      callElapsed.value = 0;
      activeCall.value = {
        person, type, incoming, phase: incoming ? 'incoming' : 'calling',
        muted: false, cameraEnabled: type === 'video', answeredAt: 0,
      };
      open('call', person.id);
      if (!incoming) callAnswerTimer = setTimeout(connectCall, 1600);
    }
    function connectCall() {
      const call = activeCall.value;
      if (!call || call.phase === 'connected' || page.value !== 'call') return;
      call.phase = 'connected';
      call.answeredAt = Date.now();
      callClock = setInterval(() => {
        if (activeCall.value === call) callElapsed.value = Math.floor((Date.now() - call.answeredAt) / 1000);
      }, 250);
    }
    function recordCall(outcome) {
      const call = activeCall.value;
      if (!call) return;
      clearTimeout(callAnswerTimer);
      clearInterval(callClock);
      const seconds = call.answeredAt ? Math.floor((Date.now() - call.answeredAt) / 1000) : null;
      const typeLabel = call.type === 'video' ? '视频通话' : '语音通话';
      append(item(typeLabel + ' · ' + outcome, !call.incoming, 'call', {
        callType: call.type, outcome, duration: seconds === null ? '' : formatCallDuration(seconds),
      }), call.person);
      activeCall.value = null;
    }
    function finishCall(outcome) {
      recordCall(outcome);
      back('messages');
    }
    function deliverMessage(message, person) {
      const needsFriend = !person.group && !person.letter && person.id !== support.id;
      const fail = failNextSend || navigator.onLine === false;
      failNextSend = false;
      setTimeout(() => {
        message.delivery = needsFriend || fail || navigator.onLine === false ? 'failed' : 'sent';
        if (needsFriend) setNotice('对方不是您的好友，无法发送消息');
        if (message.delivery === 'sent' && person.id === support.id) append(item('收到。'), person);
      }, 250);
    }
    function retryMessage(message) {
      if (message.delivery !== 'failed') return;
      message.delivery = 'sending';
      deliverMessage(message, activePerson.value);
    }
    function showMessageMenu(message) {
      cancelMessagePress();
      if (message.kind !== 'text' || message.delivery === 'sending') return;
      currentMessage.value = message;
      reactionPickerOpen.value = false;
      reactionSearch.value = '';
      modal.value = 'message-menu';
    }
    function chooseReaction(glyph, label) {
      const message = currentMessage.value;
      if (modal.value !== 'message-menu' || !message) return;
      const reactions = message.reactions ?? [];
      message.reactions = reactions.some(reaction => reaction.glyph === glyph) ? reactions.filter(reaction => reaction.glyph !== glyph) : [...reactions, { glyph, label }];
      recentReactions.value = [[glyph, label], ...recentReactions.value.filter(([recent]) => recent !== glyph)].slice(0, 6);
      modal.value = '';
    }
    function startPress(event, callback) {
      cancelMessagePress();
      if (event.button !== 0) return;
      pressOrigin = { x: event.clientX, y: event.clientY };
      pressTimer = setTimeout(callback, 500);
    }
    function startMessagePress(message, event) {
      if (message.kind === 'text') startPress(event, () => showMessageMenu(message));
    }
    function startConversationPress(person, event) {
      if (!chatSelecting.value) startPress(event, () => showConversationMenu(person));
    }
    function cancelMessagePress() {
      clearTimeout(pressTimer);
      pressOrigin = null;
    }
    function moveMessagePress(event) {
      if (pressOrigin && Math.hypot(event.clientX-pressOrigin.x, event.clientY-pressOrigin.y) > 9) cancelMessagePress();
    }
    function clearMessageComposer() {
      if (editingMessage.value) draft.value = draftBeforeEdit;
      draftBeforeEdit = '';
      editingMessage.value = null;
      replyContext.value = null;
    }
    function prepareMessageComposer(edit) {
      const message = currentMessage.value;
      if (!message || message.kind !== 'text' || (edit && (!message.mine || message.delivery === 'failed'))) return;
      clearMessageComposer();
      if (edit) {
        draftBeforeEdit = draft.value;
        editingMessage.value = message;
        draft.value = message.text;
      } else {
        replyContext.value = { author: message.mine ? profile.nickname : message.sender || activePerson.value.name, text: message.text };
      }
      chatPanel.value = '';
      modal.value = '';
      scrollChat();
      nextTick(() => composerInput.value?.focus());
    }
    async function copyMessage() {
      const text = currentMessage.value?.text;
      modal.value = '';
      if (text) await copyText(text, '已复制');
    }
    function startMessageSelection() {
      if (!currentMessage.value) return;
      selectingMessages.value = true;
      selectedMessageIds.add(currentMessage.value.id);
      chatPanel.value = '';
      modal.value = '';
    }
    function exitMessageSelection() {
      selectingMessages.value = false;
      selectedMessageIds.clear();
    }
    function toggleMessageSelection(id) {
      if (selectedMessageIds.has(id)) selectedMessageIds.delete(id);
      else selectedMessageIds.add(id);
    }
    function selectAllMessages() {
      if (allMessagesSelected.value) selectedMessageIds.clear();
      else selectableMessages.value.forEach(message => selectedMessageIds.add(message.id));
    }
    function openMessageForward() {
      messagesToForward.value = selectingMessages.value ? selectableMessages.value.filter(message => selectedMessageIds.has(message.id)) : [currentMessage.value].filter(Boolean);
      if (messagesToForward.value.length) open('forward-message', activePerson.value.id);
    }
    function forwardMessage(person) {
      if (!messagesToForward.value.length || !forwardTargets.value.some(target => target.id === person.id)) return;
      for (const message of messagesToForward.value) {
        const kind = ['file', 'image', 'voice'].includes(message.kind) ? message.kind : 'text';
        append(item(message.text, true, kind, { url: message.url, size: message.size, duration: message.duration, original: message.original }), person);
      }
      exitMessageSelection();
      setNotice('已转发到 ' + person.name);
      back('messages');
    }
    function recallMessage() {
      const message = currentMessage.value;
      if (message?.mine && message.kind === 'text') Object.assign(message, { text: '你撤回了一条消息', kind: 'recalled' });
      modal.value = '';
    }
    function deleteMessage() {
      const thread = threads[activePerson.value.id];
      if (!thread || !selectedMessageIds.size) return;
      threads[activePerson.value.id] = thread.filter(message => !selectedMessageIds.has(message.id));
      exitMessageSelection();
      modal.value = '';
      setNotice('消息已删除');
    }

    function toggleChatPanel(panel) {
      chatPanel.value = chatPanel.value === panel ? '' : panel;
      scrollChat();
    }

    function pickFile(mode) {
      const chooser = fileInput.value;
      if (!chooser) return;
      fileMode = mode;
      fileOwner = activePerson.value;
      chooser.accept = mode === 'file' ? '' : 'image/*';
      chooser.multiple = mode === 'image';
      if (mode === 'camera') chooser.setAttribute('capture', 'environment');
      else chooser.removeAttribute('capture');
      chooser.click();
    }

    function attachFile(event) {
      const files = Array.from(event.target.files ?? []);
      event.target.value = '';
      if (!files.length || !fileOwner) return;
      if (fileMode !== 'file') {
        const images = files.filter(file => file.type.startsWith('image/'));
        (pendingByChat[fileOwner.id] ??= []).push(...images.map(file => ({ id: ++messageId, file, url: URL.createObjectURL(file) })));
        chatPanel.value = '';
        return;
      }
      const file = files[0];
      const size = file.size < 1024 * 1024 ? (file.size / 1024).toFixed(1) + ' KB' :
        (file.size / 1024 / 1024).toFixed(1) + ' MB';
      append(item(file.name, true, 'file', { size, url: URL.createObjectURL(file) }), fileOwner);
      chatPanel.value = '';
    }
    function previewPicture(picture) {
      picturePreview.value = picture;
      modal.value = 'picture-preview';
    }
    function removePendingPicture(picture) {
      if (picturesBusy.value) return;
      const list = pendingByChat[activePerson.value.id];
      const index = list?.findIndex(entry => entry.id === picture.id) ?? -1;
      if (index < 0) return;
      list.splice(index, 1);
      URL.revokeObjectURL(picture.url);
    }
    async function preparePicture(picture, original) {
      if (original || picture.file.type === 'image/gif') return picture.url;
      const image = new Image();
      image.src = picture.url;
      await image.decode();
      const scale = Math.min(1, 1280 / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext('2d');
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', .85));
      return blob ? URL.createObjectURL(blob) : picture.url;
    }
    async function sendPendingPictures() {
      if (picturesBusy.value || !pendingPictures.value.length) return;
      const person = activePerson.value;
      const pictures = [...pendingPictures.value];
      const original = sendOriginal.value;
      const results = [];
      picturesBusy.value = true;
      try {
        for (const picture of pictures) results.push(await preparePicture(picture, original));
        pictures.forEach((picture, index) => {
          const url = results[index];
          append(item('图片', true, 'image', { url, original }), person);
          if (url !== picture.url) URL.revokeObjectURL(picture.url);
        });
        const sent = new Set(pictures.map(picture => picture.id));
        pendingByChat[person.id] = pendingByChat[person.id].filter(picture => !sent.has(picture.id));
        sendOriginal.value = false;
      } catch {
        results.forEach((url, index) => { if (url !== pictures[index].url) URL.revokeObjectURL(url); });
        setNotice('发送失败，请重试');
      } finally {
        picturesBusy.value = false;
      }
    }
    function toggleVoiceMode() {
      if (voiceMode.value) {
        stopVoiceCapture(false);
        return;
      }
      voiceMode.value = true;
      chatPanel.value = '';
      voiceStarted.value = Date.now();
      voiceElapsed.value = '00:00';
      voiceTimer = setInterval(() => {
        const seconds = Math.floor((Date.now() - voiceStarted.value) / 1000);
        voiceElapsed.value = [Math.floor(seconds / 60), seconds % 60].map(value => String(value).padStart(2, '0')).join(':');
      }, 200);
    }
    function stopVoiceCapture(send) {
      const start = voiceStarted.value;
      clearInterval(voiceTimer);
      voiceMode.value = false;
      voiceStarted.value = null;
      voiceOrigin = undefined;
      if (send && start !== null && Date.now() - start >= 280) {
        append(item('语音消息', true, 'voice', { url: './assets/voice-demo.wav', duration: '00:02' }));
      }
    }
    function startVoiceGesture(event) {
      voiceOrigin = event.clientX;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    function releaseVoiceCapture(event) {
      if (voiceOrigin !== undefined && voiceOrigin - event.clientX >= 42) stopVoiceCapture(false);
      voiceOrigin = undefined;
    }
    function stopVoicePlayback() {
      voicePlayer?.pause();
      voicePlayer = undefined;
      playingVoiceId.value = null;
    }
    function playVoice(message) {
      const alreadyPlaying = playingVoiceId.value === message.id;
      stopVoicePlayback();
      if (alreadyPlaying) return;
      const audio = new Audio(message.url);
      voicePlayer = audio;
      playingVoiceId.value = message.id;
      audio.addEventListener('ended', () => { if (voicePlayer === audio) stopVoicePlayback(); }, { once: true });
      audio.play().catch(() => {
        if (voicePlayer === audio) {
          stopVoicePlayback();
          setNotice('语音播放失败，请稍后重试');
        }
      });
    }

    function openAttachment(file) {
      activeAttachment.value = file;
      modal.value = 'attachment';
    }
    function openRedComposer() {
      if (!canSendRed.value) return;
      Object.assign(redDraft, { amount: '', count: '', note: '' });
      redError.value = '';
      open('send-red', activePerson.value.id);
    }
    function sendRed() {
      if (!canSendRed.value) return;
      const direct = !activePerson.value.group;
      const parts = /^(\d{1,9})(?:\.(\d{1,2}))?$/.exec(redDraft.amount.trim());
      const cents = parts ? Number(parts[1])*100 + Number((parts[2] ?? '').padEnd(2,'0')) : 0;
      const count = direct ? 1 : Number(redDraft.count);
      if (!direct && (!/^\d+$/.test(redDraft.count) || !Number.isSafeInteger(count) || count < 1)) {
        redError.value = '请输入红包个数';
        return;
      }
      if (cents < count) {
        redError.value = '请输入有效金额';
        return;
      }
      if (cents > availableCents.value) { redError.value = '余额不足'; return; }
      walletRecords.value.unshift(walletEntry('red-sent', -cents));
      append(item(direct ? '红包' : '群红包', true, 'red', { direct, count, cents, sender: profile.nickname, note: redDraft.note.trim(), claims: [] }));
      back('messages');
    }
    function canClaimRed(packet) {
      return !!packet && !(packet.direct && packet.mine) && !packet.claimed && packet.claims.length < packet.count;
    }
    function redCaption(packet) {
      return packet.note || (packet.direct ? '红包' : '拼手气红包');
    }
    function redDetailStatus(packet) {
      if (packet.claimed) return '已领取';
      if (packet.claims.length >= packet.count) return '红包已被领完';
      return packet.direct && packet.mine ? '待对方领取' : '红包金额';
    }
    function selectEnvelope(message) {
      selectedRed.value = message;
      modal.value = canClaimRed(message) ? 'open-red' : 'receive-red';
    }
    function claimRed() {
      const packet = selectedRed.value;
      if (!canClaimRed(packet)) return;

      const remainingCount = packet.count - packet.claims.length;
      const remainingCents = packet.cents - redReceivedTotal.value;
      const maxShare = Math.min(remainingCents - remainingCount + 1, Math.floor(2 * remainingCents / remainingCount));
      const cents = remainingCount === 1
        ? remainingCents
        : Math.min(packet.receivedCents ?? (1 + Math.floor(Math.random() * maxShare)), maxShare);
      packet.receivedCents = cents;
      packet.claimed = true;
      packet.claims.push({ name: profile.nickname, cents });
      walletRecords.value.unshift(walletEntry('red-received', cents));
      modal.value = 'receive-red';
    }
    const redReceivedTotal = computed(() => selectedRed.value?.claims.reduce((sum, entry) => sum + entry.cents, 0) ?? 0);
    const money = cents => (cents / 100).toFixed(2);

    const friendRequestsSent = reactive(new Set());
    function addFriend(person) {
      if (person.group || friendRequestsSent.has(person.id) || people.some(contact => contact.id === person.id && contact.letter)) return;
      friendRequestsSent.add(person.id);
      setNotice(`已将 ${person.name} 添加到联系人`);
    }
    function rejectFriend(request) {
      if (request.status === 'pending') request.status = 'rejected';
    }
    function acceptFriend(request) {
      if (request.status !== 'pending') return;
      const { person } = request;
      const contact = people.find(candidate => candidate.id === person.id);
      if (contact) contact.letter = person.letter;
      else people.push({ ...person });
      friendRequestsSent.delete(person.id);
      request.status = 'accepted';
      setNotice('已通过好友申请');
    }

    const checkScenario = scenario.get('check');
    const checkDay = checkScenario === 'rollover' ? '2026-12-01' : demoToday;
    const todayMonth = { year: Number(checkDay.slice(0, 4)), month: Number(checkDay.slice(5, 7)) - 1 };
    const priorDays = checkScenario === 'empty' ? [] : checkScenario === 'missed' ? [-2, -3] : checkScenario === 'cycle' ? Array.from({ length: 29 }, (_, index) => -1-index) : [-1, -2];
    const checkRecords = ref(priorDays.map((offset, index) => ({ date: checkDate(checkDay, offset), points: dailyPoints(priorDays.length-index), bonus: 0 })));
    const viewing = ref({ ...todayMonth });
    const checkBusy = ref(false);
    const subsidyScenario = scenario.get('subsidy');
    const subsidyViewing = ref({ year: Number(demoToday.slice(0, 4)), month: Number(demoToday.slice(5, 7)) - 1 });
    const priorSubsidyDays = subsidyScenario === 'cycle' ? 29 : subsidyScenario === 'restart' ? 30 : 0;
    const subsidyOffsets = subsidyScenario === 'missed' ? [-2, -3] : Array.from({ length: priorSubsidyDays }, (_, index) => -index - 1);
    const subsidyRecords = ref(subsidyOffsets.map(offset => ({ date: checkDate(demoToday, offset), kind: 'check' })));
    if (subsidyScenario === 'restart') subsidyRecords.value.unshift({ date: checkDate(demoToday, -1), kind: 'reward' });
    const subsidySignedDates = computed(() => new Set(subsidyRecords.value.filter(record => record.kind === 'check').map(record => record.date)));
    const subsidyClaimed = computed(() => subsidySignedDates.value.has(demoToday));
    const subsidyLastReward = computed(() => subsidyRecords.value.find(record => record.kind === 'reward')?.date ?? '');
    const subsidyStreak = computed(() => {
      const start = subsidyClaimed.value ? 0 : -1;
      let days = 0;
      while (subsidySignedDates.value.has(checkDate(demoToday, start - days))) days += 1;
      return days;
    });
    const subsidyCycleDays = computed(() => {
      const start = subsidyClaimed.value ? 0 : -1;
      let days = 0;
      while (days < subsidyStreak.value && checkDate(demoToday, start - days) > subsidyLastReward.value) days += 1;
      return Math.min(days, 30);
    });
    const subsidyMonthCount = computed(() => {
      const { year, month } = subsidyViewing.value;
      const prefix = year + '-' + String(month + 1).padStart(2, '0');
      return [...subsidySignedDates.value].filter(date => date.startsWith(prefix)).length;
    });
    const subsidyAmount = kind => kind === 'reward' ? 300000 : 50000;
    const subsidyBalance = computed(() => subsidyRecords.value.reduce((sum, record) => sum + subsidyAmount(record.kind), 0));
    function checkInForSubsidy() {
      if (subsidyClaimed.value) return;
      subsidyRecords.value.unshift({ date: demoToday, kind: 'check' });
    }
    function claimSubsidyReward() {
      if (subsidyCycleDays.value < 30) return;
      subsidyRecords.value.unshift({ date: demoToday, kind: 'reward' });
    }
    let failNextCheck = scenario.get('checkFail') === 'once';
    const awardedMilestones = reactive(new Set());
    const redemptions = ref([]);
    const shopItems = [
      { id: 'tumbler', name: '随行保温杯', category: '日用', points: 12, caption: '深蓝款 · 不锈钢杯身' },
      { id: 'earbuds', name: '无线蓝牙耳机', category: '数码', points: 60, caption: '曜石黑 · 含充电盒' },
      { id: 'notebook', name: '精装笔记本套装', category: '办公', points: 10, caption: '深蓝 A5 · 配金属笔' },
      { id: 'desk-lamp', name: '折叠 LED 台灯', category: '办公', points: 30, caption: '暖白款 · USB 供电' },
    ];
    const shopCategories = ['全部', '日用', '数码', '办公'];
    const shopCategory = ref('全部');
    const shownShopItems = computed(() => shopCategory.value === '全部' ? shopItems : shopItems.filter(item => item.category === shopCategory.value));
    const shopProduct = computed(() => shopItems.find(item => item.id === route.value.key));
    const shopOrder = computed(() => redemptions.value.find(item => item.id === route.value.key));
    const shopPhoto = item => './assets/shop-' + item.id + '.webp';
    const redeemItem = ref(null);
    const shippingDraft = reactive({ name: '', phone: '', address: '' });
    const shippingError = ref('');
    const drawPrizes = [
      { name: '10 积分', points: 10 }, { name: '50 积分', points: 50 },
      { name: '纪念徽章' }, { name: '100 积分', points: 100 },
      { name: '谢谢参与', noPrize: true }, { name: '20 积分', points: 20 },
    ];
    const drawResult = ref(null);
    const drawBusy = ref(false);
    const drawAngle = ref(0);
    const identitySides = { front: '正面', back: '反面' };
    const identityDraft = reactive({ name: '', number: '', front: null, back: null });
    const identityError = ref('');
    const identitySubmitted = ref(false);
    const signedDates = computed(() => new Set(checkRecords.value.map(record => record.date)));
    const signed = computed(() => signedDates.value.has(checkDay));
    const pointTypes = [
      { id: 'check', name: '签到' },
      { id: 'bonus', name: '长期签到奖励' },
      { id: 'draw', name: '幸运抽奖' },
      { id: 'shop', name: '商城兑换' },
    ];
    const pointType = ref('all');
    const pointsLedger = computed(() => {
      const entries = checkRecords.value.flatMap(({ date, points, bonus }) => [
        { id: 'check-' + date, date, type: 'check', label: '每日签到', delta: points },
        ...(bonus ? [{ id: 'bonus-' + date, date, type: 'bonus', label: '长期签到奖励', delta: bonus }] : []),
      ]);
      entries.push(...redemptions.value.map(item => ({
        id: 'shop-' + item.id, date: item.date, type: 'shop', label: '兑换 ' + item.name, delta: -item.points, order: item.id,
      })));
      const draw = drawResult.value;
      if (draw?.prize.points) entries.push({ id: 'draw-prize', date: draw.date, type: 'draw', label: '幸运抽奖', delta: draw.prize.points });
      if (draw?.cost) entries.push({ id: 'draw-cost', date: draw.date, type: 'draw', label: '幸运抽奖', delta: -draw.cost });
      return entries.sort((first, second) => second.date.localeCompare(first.date));
    });
    const shownPoints = computed(() => pointType.value === 'all'
      ? pointsLedger.value
      : pointsLedger.value.filter(entry => pointType.value === entry.type));
    const amount = computed(() => pointsLedger.value.reduce((sum, entry) => sum + entry.delta, 0));
    const streak = computed(() => {
      let days = 0;
      const last = signed.value ? 0 : -1;
      while (signedDates.value.has(checkDate(checkDay, last-days))) days++;
      return days;
    });
    const cycleDays = computed(() => [...longRewards.keys()].find(days => !awardedMilestones.has(days)) ?? 360);
    function selectRedemption(item) {
      if (amount.value < item.points || redemptions.value.some(entry => entry.id === item.id)) return;
      redeemItem.value = item;
      Object.assign(shippingDraft, redemptions.value[0]?.shipping ?? { name: '', phone: '', address: '' });
      shippingError.value = '';
      modal.value = 'redeem-points';
    }
    function redeemPoints() {
      const item = redeemItem.value;
      if (!item || amount.value < item.points || redemptions.value.some(entry => entry.id === item.id)) return;
      const { name, phone, address } = shippingDraft;
      if (!name || !phone || !address) {
        shippingError.value = '请填写完整的收货信息';
        return;
      }
      if (!/^1\d{10}$/.test(phone)) {
        shippingError.value = '请输入 11 位手机号';
        return;
      }
      redemptions.value.unshift({ ...item, date: checkDay, shipping: { name, phone, address } });
      modal.value = '';
      open('shop-orders');
      setNotice('兑换已提交');
    }
    function spinWheel() {
      if (drawBusy.value || drawResult.value !== null) return;
      const selected = Math.floor(Math.random() * drawPrizes.length);
      drawBusy.value = true;
      drawAngle.value = 5 * 360 + (360 - selected * 60) % 360;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setTimeout(() => {
        drawResult.value = { prize: drawPrizes[selected], cost: 0, date: checkDay };
        drawBusy.value = false;
        if (page.value === 'lucky-draw') modal.value = 'draw-result';
      }, reducedMotion ? 100 : 2150);
    }
    function removeIdentityImage(side) {
      if (identityDraft[side]) URL.revokeObjectURL(identityDraft[side].url);
      identityDraft[side] = null;
      identityError.value = '';
    }
    function clearIdentityDraft() {
      Object.keys(identitySides).forEach(removeIdentityImage);
      identityDraft.name = '';
      identityDraft.number = '';
    }
    function chooseIdentityImage(side, event) {
      const [file] = event.target.files;
      event.target.value = '';
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        identityError.value = '请选择图片文件';
        return;
      }
      removeIdentityImage(side);
      identityDraft[side] = { url: URL.createObjectURL(file), ready: false };
    }
    function identityImageLoaded(side, event, ready) {
      const image = identityDraft[side];
      if (image?.url !== event.target.src) return;
      if (ready) image.ready = true;
      else {
        removeIdentityImage(side);
        identityError.value = '无法预览图片，请重新选择';
      }
    }
    function submitIdentity() {
      if (!identityDraft.name || !identityDraft.front?.ready || !identityDraft.back?.ready) return;
      if (!/^\d{17}[\dXx]$/.test(identityDraft.number)) {
        identityError.value = '请输入18位身份证号码';
        return;
      }
      identitySubmitted.value = true;
      clearIdentityDraft();
    }
    const monthCount = computed(() => {
      const prefix = viewing.value.year + '-' + String(viewing.value.month+1).padStart(2, '0') + '-';
      return checkRecords.value.filter(entry => entry.date.startsWith(prefix)).length;
    });
    const activeCalendarMonth = computed(() => page.value === 'native-check' ? subsidyViewing.value : viewing.value);
    const calendarTitle = computed(() => activeCalendarMonth.value.year + '年' + (activeCalendarMonth.value.month + 1) + '月');
    const calendar = computed(() => {
      const { year, month } = activeCalendarMonth.value;
      const subsidyCalendar = page.value === 'native-check';
      const activeDate = subsidyCalendar ? demoToday : checkDay;
      const activeSignedDates = subsidyCalendar ? subsidySignedDates.value : signedDates.value;
      const offset = new Date(year, month, 1).getDay();
      const days = new Date(year, month+1, 0).getDate();
      const dates = Array.from({ length: offset }, (_, index) => ({ key: 'blank-' + index }));
      for (let number = 1; number <= days; number++) {
        const date = [year, String(month+1).padStart(2, '0'), String(number).padStart(2, '0')].join('-');
        dates.push({ key: date, number, today: date === activeDate, signed: activeSignedDates.has(date) });
      }
      return dates;
    });
    function viewMonth(diff) {
      const target = page.value === 'native-check' ? subsidyViewing : viewing;
      const date = new Date(target.value.year, target.value.month+diff, 1);
      target.value = { year: date.getFullYear(), month: date.getMonth() };
    }
    function checkIn() {
      if (signed.value || checkBusy.value) return;
      const fail = failNextCheck || !online.value;
      failNextCheck = false;
      checkBusy.value = true;
      setTimeout(() => {
        checkBusy.value = false;
        if (fail || !online.value) {
          if (page.value === 'check-in') setNotice('签到失败：无法连接服务器，请检查网络');
          return;
        }
        if (signed.value) return;
        const days = streak.value + 1;
        const bonus = awardedMilestones.has(days) ? 0 : longRewards.get(days) ?? 0;
        if (bonus) awardedMilestones.add(days);
        checkRecords.value.unshift({ date: checkDay, points: dailyPoints(days), bonus });
        viewing.value = { ...todayMonth };
        if (page.value === 'check-in') setNotice('签到成功  连续加油');
      }, 250);
    }

    function editProfile() {
      Object.assign(profileDraft, { nickname: profile.nickname, bio: profile.bio, gender: profile.gender, birthday: profile.birthday });
      open('profile-edit');
    }
    function pickAvatar(source) {
      const input = avatarInput.value;
      if (!input) return;
      if (source === 'camera') input.setAttribute('capture', 'user');
      else input.removeAttribute('capture');
      input.click();
    }
    function chooseAvatar(event) {
      const [file] = event.target.files;
      event.target.value = '';
      if (!file?.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (page.value !== 'profile-edit') return;
        avatarPreview.value = reader.result;
        modal.value = 'avatar-crop';
      };
      reader.readAsDataURL(file);
    }
    async function saveAvatar() {
      const source = avatarPreview.value;
      const image = new Image();
      image.src = source;
      try { await image.decode(); } catch { setNotice('失败'); return; }
      if (page.value !== 'profile-edit' || modal.value !== 'avatar-crop' || avatarPreview.value !== source) return;
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 256;
      const size = Math.min(image.naturalWidth, image.naturalHeight);
      canvas.getContext('2d').drawImage(image, (image.naturalWidth-size)/2, (image.naturalHeight-size)/2, size, size, 0, 0, 256, 256);
      profile.avatar = canvas.toDataURL('image/png');
      modal.value = '';
      avatarPreview.value = '';
      setNotice('保存成功');
    }
    function saveProfile() {
      if (!profileDraft.nickname) return;
      Object.assign(profile, profileDraft);
      savedLocalNickname.value = profile.nickname;
      setNotice('保存成功');
      back('profile');
    }
    function openNicknameEditor() {
      nicknameDraft.value = profile.nickname;
      modal.value = 'edit-nickname';
      nextTick(() => nicknameInput.value?.focus());
    }
    function saveNickname() {
      const name = nicknameDraft.value.trim();
      if (!name || name.length > 50) return;
      profile.nickname = name;
      savedLocalNickname.value = name;
      modal.value = '';
    }
    function openWithdrawAccount(method) {
      open(method.id === 'alipay' ? 'alipay' : 'withdraw-account', method.id === 'alipay' ? '' : method.id);
    }
    function saveWithdrawAccount() {
      const method = accountMethod.value;
      if (!method || method.fields.some(field => !accountDraft.value[field.key])) return;
      boundAccounts[method.id] = { ...accountDraft.value };
      if (pendingPayout.value?.id === method.id) withdrawDraft.method = method.id;
      setNotice('保存成功');
      back('withdraw');
    }

    async function copyText(value, feedback) {
      let copied = false;
      try {
        await navigator.clipboard.writeText(value);
        copied = true;
      } catch {
        const input = document.createElement('textarea');
        input.value = value;
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.append(input);
        input.select();
        copied = document.execCommand('copy');
        input.remove();
      }
      setNotice(copied ? feedback : '失败');
    }
    function copyInvite() {
      return copyText(demoInviteCode, '邀请码已复制');
    }
    function openWithdrawal() {
      Object.assign(withdrawDraft, { amount: '', method: '' });
      withdrawError.value = '';
      withdrawReceipt.value = null;
      open('withdraw-request');
    }
    function hasPayoutAccount(method) {
      return method.fields.every(field => Boolean(boundAccounts[method.id]?.[field.key]));
    }
    function payoutAccountLabel(method) {
      if (!hasPayoutAccount(method)) return '未绑定';
      const account = boundAccounts[method.id].account;
      const characters = Array.from(account);
      if (characters.length <= 7) return '****';
      return `${characters.slice(0, 3).join('')}****${characters.slice(-4).join('')}`;
    }
    function chooseWithdrawMethod(method) {
      withdrawError.value = '';
      if (!hasPayoutAccount(method)) {
        pendingPayout.value = method;
        modal.value = 'withdraw-account-required';
        return;
      }
      pendingPayout.value = null;
      withdrawDraft.method = method.id;
      modal.value = '';
    }
    function withdrawalCents(amount) {
      return /^\d{1,6}(?:\.\d{1,2})?$/.test(amount) ? Math.round(Number(amount) * 100) : 0;
    }
    function submitWithdrawal() {
      if (withdrawReceipt.value) return;
      const cents = withdrawalCents(withdrawDraft.amount);
      if (cents < 1) { withdrawError.value = '请输入有效金额'; return; }
      if (cents > availableCents.value) { withdrawError.value = '余额不足'; return; }
      if (!selectedPayout.value) { withdrawError.value = '请选择提现方式'; return; }
      if (!hasPayoutAccount(selectedPayout.value)) {
        chooseWithdrawMethod(selectedPayout.value);
        return;
      }
      walletRecords.value.unshift(walletEntry('withdrawal', -cents, demoToday, '审核中'));
      withdrawReceipt.value = (cents / 100).toFixed(2);
      withdrawError.value = '';
      modal.value = 'withdraw-success';
    }

    function editPassword(nextPage) {
      Object.assign(passwordDraft, { old: '', first: '', confirm: '' });
      passwordError.value = '';
      open(nextPage);
    }
    function savePassword() {
      const fromModal = modal.value === 'change-password';
      const payment = fromModal ? passwordMode.value === 'pay-password' : page.value === 'pay-password';
      if (payment && (!/^\d{6}$/.test(passwordDraft.first) || (payConfigured.value && passwordDraft.old !== payPassword.value))) {
        passwordError.value = payConfigured.value && passwordDraft.old !== payPassword.value ? '设置支付密码失败' : '请设置6位数字支付密码';
        return;
      }
      if (!payment && (!passwordDraft.old || !passwordDraft.first)) {
        passwordError.value = '请完整填写原密码和新密码';
        return;
      }
      if (!payment && (passwordDraft.first.length < 6 || passwordDraft.first.length > 20)) {
        passwordError.value = '请输入 6–20 位新密码';
        return;
      }
      if (!payment && passwordDraft.old !== demoCredential.password) {
        passwordError.value = '修改密码失败';
        return;
      }
      if (!payment && passwordDraft.old === passwordDraft.first) {
        passwordError.value = '新密码不能和原密码相同';
        return;
      }
      if (passwordDraft.first !== passwordDraft.confirm) {
        passwordError.value = '两次输入的新密码不一致';
        return;
      }
      if (payment) {
        payPassword.value = passwordDraft.first;
        setNotice('保存成功');
        if (fromModal) modal.value = '';
        else back('password-menu');
      } else {
        Object.assign(demoCredential, { account: auth.account, password: passwordDraft.first, changed: true });
        logout();
        setNotice('密码已修改，请用新密码重新登录');
      }
      Object.assign(passwordDraft, { old: '', first: '', confirm: '' });
    }
    function resetNotifications() {
      Object.assign(notifications, notificationDefaults);
      notificationTone.value = '弹钱';
      modal.value = '';
    }
    function endOtherDevices() {
      otherDevices.value = [];
      modal.value = '';
    }
    function selectDeviceToEnd(device) {
      selectedDevice.value = device.id;
      modal.value = 'end-device';
    }
    function endDevice() {
      otherDevices.value = otherDevices.value.filter(device => device.id !== selectedDevice.value);
      selectedDevice.value = '';
      modal.value = '';
      setNotice('已终止该设备会话');
    }
    function openJoinMeeting() {
      meetingError.value = '';
      meetingCode.value = '';
      modal.value = 'join-meeting';
    }
    function meetingState(room) {
      if (room.ended || Date.now() >= room.start + room.duration * 60000) return '已结束';
      return Date.now() < room.start ? '未开始' : '进行中';
    }
    function joinMeeting(code = meetingCode.value) {
      if (!/^\d{9}$/.test(code)) {
        meetingError.value = '请输入 9 位会议号';
        return;
      }
      let room = meetingRooms.value.find(entry => entry.code === code);
      if (!room && code === demoMeetingCode) {
        room = { code, subject: '项目评审', start: Date.now(), duration: 60, host: false, ended: false };
        meetingRooms.value.unshift(room);
      }
      if (!room) {
        meetingError.value = '会议不存在';
        return;
      }
      const state = meetingState(room);
      if (state !== '进行中') {
        meetingError.value = state === '已结束' ? '会议已结束' : state;
        return;
      }
      meetingError.value = '';
      open('meeting-room', code);
      setNotice('已加入会议');
    }
    function leaveMeeting() {
      modal.value = '';
      back('meeting');
    }
    function endMeeting() {
      if (!currentMeeting.value?.host || meetingState(currentMeeting.value) !== '进行中') return;
      currentMeeting.value.ended = true;
      leaveMeeting();
      setNotice('会议已结束');
    }
    function openMeetingCreate() {
      const later = new Date(Date.now()+3600000);
      const start = new Date(later.getTime()-later.getTimezoneOffset()*60000).toISOString().slice(0,16);
      Object.assign(meetingDraft, { subject: '', immediate: true, start, duration: 60 });
      meetingCreateError.value = '';
      open('meeting-create');
    }
    function createMeeting() {
      if (!meetingDraft.subject) {
        meetingCreateError.value = '请填写会议主题';
        return;
      }
      const now = Date.now();
      const start = meetingDraft.immediate ? now : new Date(meetingDraft.start).getTime();
      if (!Number.isFinite(start) || start < now) {
        meetingCreateError.value = '选择开始时间';
        return;
      }
      const code = String(820156400 + ++roomSequence);
      meetingRooms.value.unshift({ code, subject: meetingDraft.subject, start, duration: Number(meetingDraft.duration), host: true, ended: false });
      history.replaceState({ depth: history.state?.depth ?? 0 }, '', '#meeting-detail/' + code);
      applyRoute({ page: 'meeting-detail', key: code });
      setNotice('会议已创建');
    }
    function meetingStartTime(room) {
      return new Date(room.start).toLocaleString('zh-CN', { hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    }

    onMounted(() => {
      history.replaceState({ depth: 0 }, '', location.href);
      window.addEventListener('popstate', event => applyRoute(readRoute(), event.state?.listState));
      window.addEventListener('online', () => { online.value = true; });
      window.addEventListener('offline', () => { online.value = false; });
      window.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
          if (modal.value) modal.value = '';
          else stopVoiceCapture(false);
        }
      });
      applyRoute(readRoute());
    });

    return {
      appVersion, titles, title, tabs, page, parentPages, profileLinks, isTab, isAuth, authDocuments, people, requests, search, foundConversations,
      chatFilter, chatSelecting, selectedChats, toggleChatSelection, toggleSelectedChat, visibleChatsSelected, selectAllChats, applyChatBatch,
      conversationTarget, conversationMuted, showConversationMenu, startConversationPress, toggleConversationMute, removeConversation,
      favorites, mediaEntries, currentMedia, conversationMediaItems, contactRemarks, contactMuted, sharedGroups,
      meetingDurations, nextMeetingSlots, formatMeetingSlot, profileQrGroup,
      settingsTabs, settingsSection, notificationGroups, notificationTone, systemNotificationAllowed, requestNotifications,
      notificationTones, playTone, passwordMode, visiblePasswords, openPasswordModal, togglePasswordField,
      networkLines, selectedNetwork, networkPending, networkAvailableCount, selectedLatency, testNetwork, stickerTab, scanImage, scanResult, decodeScan,
      stickerPacks, stickerStoreTab, stickerStoreSearch, stickerSettings, addedStickerPacks, customStickers,
      stickerFile, arrangingStickers, selectedStickers, toggleStickerArrangement, toggleStickerSelection,
      openStickerStore, addCustomSticker, removeSelectedStickers,
      squareAudiences, squareContacts, squareEntries, squareQuery, squareDraft, squareAudience, squareUpload, squareTopic,
      openSquarePost, pickSquareAudience, selectSquarePerson, confirmSquareAudience, pickSquareFile, attachSquareFile, publishSquarePost,
      contactSections, activePerson, activeMessages, friendRequestsSent, newFriendSearch, historySearch,
      newFriendQuery, userSearchResults, searchUsers, chatWithSearchResult,
      currentGroup, groupRoster, filteredGroupCandidates, groupDraft, groupAvatarInput, selectGroupAvatar,
      memberSearch, memberSearchVisible, toggleMemberSearch, announcementDraft,
      openGroupCreation, createGroup, openGroupAnnouncements, saveGroupAnnouncement, leaveGroup,
      isGroupOwner, isGroupParticipant, groupNameDraft, memberDraft, availableGroupContacts, matchingGroupContacts, managedMember, managedIsAdmin,
      openGroupEdit, saveGroupName, openGroupMemberPicker, addGroupMembers, openGroupMemberActions, changeGroupMemberRole, removeGroupMember,
      historyResults, draft, chatPanel, modal, dialogTitle, selectedRed, activeAttachment, fileInput, surface,
      notice, auth, loginError, loginCaptcha, refreshLoginCaptcha, signup, signupAvatarInput, chooseSignupAvatar,
      showPassword, showSignupPassword, showSignupConfirm, registerError, captcha, profile, profileDraft, notifications,
      currentMessage, forwardTargets, showMessageMenu, startMessagePress, cancelMessagePress, moveMessagePress,
      quickReactions, reactionPickerOpen, reactionSearch, recentReactions, visibleReactions, chooseReaction,
      selectingMessages, selectedMessageIds, allMessagesSelected, startMessageSelection, exitMessageSelection, toggleMessageSelection, selectAllMessages, openMessageForward,
      composerInput, replyContext, editingMessage, clearMessageComposer, prepareMessageComposer,
      copyMessage, forwardMessage, recallMessage, deleteMessage, avatarInput, avatarPreview, pickAvatar, chooseAvatar, saveAvatar,
      walletBalance, withdrawDraft, withdrawError, withdrawReceipt, pendingPayout, payoutAccountLabel, openWithdrawal, chooseWithdrawMethod, submitWithdrawal,
      payoutMethods, accountDraft, accountMethod, selectedPayout, openWithdrawAccount, saveWithdrawAccount,
      inviteLabel, retryMessage,
      redDraft, redError, canSendRed, redCaption, redDetailStatus, openRedComposer, meetingError, openJoinMeeting, joinMeeting, leaveMeeting, endMeeting,
      meetingRooms, meetingDraft, meetingCreateError, currentMeeting, openMeetingCreate, createMeeting, meetingState, meetingStartTime,
      passwordDraft, passwordError, payConfigured, resetNotifications, otherDevices, endOtherDevices,
      selectDeviceToEnd, endDevice, online,
      activeCall, callDuration, startCall, connectCall, finishCall,
      pendingPictures, picturePreview, sendOriginal, picturesBusy, previewPicture, removePendingPicture, sendPendingPictures,
      voiceMode, voiceElapsed, playingVoiceId, toggleVoiceMode, startVoiceGesture, stopVoiceCapture, releaseVoiceCapture, playVoice,
      meetingCode, signed, amount, streak, news, activeNews,
      week, calendar, calendarTitle, checkBusy, monthCount, cycleDays, emojis, open, back, switchTab, login, logout, register,
      walletRecordLabels, walletRecordKind, shownWalletRecords, redReceivedTotal, money, shopCategories, shopCategory, shownShopItems, shopProduct, shopPhoto,
      redemptions, shopOrder, redeemItem, shippingDraft, shippingError, selectRedemption, redeemPoints,
      drawPrizes, drawResult, drawBusy, drawAngle, spinWheel,
      pointType, pointTypes, shownPoints,
      subsidyRecords, subsidySignedDates, subsidyClaimed, subsidyStreak, subsidyCycleDays, subsidyMonthCount,
      subsidyAmount, subsidyBalance, checkInForSubsidy, claimSubsidyReward,
      identitySides, identityDraft, identityError, identitySubmitted, chooseIdentityImage, removeIdentityImage, identityImageLoaded, submitIdentity,
      refreshCaptcha, lastMessage, enterChat, sendMessage, toggleChatPanel, pickFile, attachFile, openAttachment,
      sendRed, selectEnvelope, canClaimRed, claimRed, addFriend, rejectFriend, acceptFriend, viewMonth, checkIn, editProfile,
      saveProfile, copyInvite, copyText, editPassword, savePassword,
      nicknameDraft, nicknameInput, openNicknameEditor, saveNickname,
    };
  },
}).mount('#app');
