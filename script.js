// Target: 01 February 2026 00:00 local time
const target = new Date(2026, 1, 1, 0, 0, 0); // month: 0=Jan, 1=Feb

const $ = id => document.getElementById(id);
let timer = null;
let toastTimer = null;

function init() {
  const daysEl = $('days'), hoursEl = $('hours'), minutesEl = $('minutes'), secondsEl = $('seconds');
  const toast = $('toast');
  const msgPreview = $('msgPreview');

  const messengerUsername = 'gnud0312';
  const mMeUrl = `https://m.me/${messengerUsername}`;
  const messengerWebUrl = `https://www.messenger.com/t/${messengerUsername}`;

  const defaultMsg = "Xin chào! Mình vừa mở trang đếm ngược — chúc bạn một ngày tuyệt vời!";
  msgPreview.textContent = defaultMsg;

  function showToast(text, ms = 2800) {
    toast.textContent = text;
    toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(()=> toast.classList.remove('show'), ms);
  }

  // update DOM segment with a brief pulse animation
  function setSegment(el, value) {
    if (el.textContent !== value) {
      el.textContent = value;
      el.classList.add('pulse');
      setTimeout(()=> el.classList.remove('pulse'), 260);
    } else {
      el.textContent = value;
    }
  }

  function pulseAll() {
    [daysEl, hoursEl, minutesEl, secondsEl].forEach(el => {
      el.classList.add('pulse');
      setTimeout(()=> el.classList.remove('pulse'), 500);
    });
  }

  function updateCountdown() {
    const now = new Date();
    let diff = target - now;
    if (diff <= 0) {
      setSegment(daysEl, '00');
      setSegment(hoursEl, '00');
      setSegment(minutesEl, '00');
      setSegment(secondsEl, '00');
      pulseAll();
      showToast('Đã đến thời điểm mục tiêu 🎉', 4000);
      clearInterval(timer);
      return;
    }
    const sec = Math.floor(diff / 1000);
    const d = Math.floor(sec / 86400);
    const h = Math.floor((sec % 86400) / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    setSegment(daysEl, String(d).padStart(2,'0'));
    setSegment(hoursEl, String(h).padStart(2,'0'));
    setSegment(minutesEl, String(m).padStart(2,'0'));
    setSegment(secondsEl, String(s).padStart(2,'0'));
  }

  // Clipboard helper
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        if (ok) resolve();
        else reject(new Error('execCommand copy failed'));
      } catch (e) {
        document.body.removeChild(ta);
        reject(e);
      }
    });
  }

  // Buttons
  $('openMessenger').addEventListener('click', async () => {
    try {
      await copyToClipboard(defaultMsg);
      const w = window.open(mMeUrl, '_blank', 'noopener');
      if (!w) window.open(messengerWebUrl, '_blank', 'noopener');
      showToast('Tin nhắn đã sao chép. Trang Messenger đã mở — hãy dán và gửi.');
    } catch (e) {
      const w = window.open(mMeUrl, '_blank', 'noopener') || window.open(messengerWebUrl, '_blank', 'noopener');
      if (w) {
        showToast('Không thể sao chép tự động — vui lòng dán thủ công trong Messenger.');
      } else {
        showToast('Trình duyệt chặn popup. Hãy mở: ' + mMeUrl, 5000);
      }
    }
  });

  $('copyMsg').addEventListener('click', async () => {
    try {
      await copyToClipboard(defaultMsg);
      showToast('Đã sao chép tin nhắn vào clipboard');
    } catch {
      showToast('Không thể sao chép. Vui lòng sao chép thủ công.');
    }
  });

  // start
  updateCountdown();
  timer = setInterval(updateCountdown, 1000);

  // initial accessible toast
  const now = new Date();
  const diff = Math.max(0, target - now);
  if (diff > 0) {
    const sec = Math.floor(diff / 1000);
    const d = Math.floor(sec / 86400);
    showToast(`Còn ${d} ngày đến mục tiêu`, 1800);
  }
}

document.addEventListener('DOMContentLoaded', init);