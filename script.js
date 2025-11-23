// Elementos
const pwInput = document.getElementById('pwInput');
const checkBtn = document.getElementById('checkBtn');
const genBtn = document.getElementById('genBtn');
const copyBtn = document.getElementById('copyBtn');
const meterBar = document.getElementById('meterBar');
const meterText = document.getElementById('meterText');
const pwLen = document.getElementById('pwLen');
const toggleReveal = document.getElementById('toggleReveal');
const lenRange = document.getElementById('lenRange');
const lenVal = document.getElementById('lenVal');

// Actualiza valor del rango
lenRange.addEventListener('input', ()=> lenVal.textContent = lenRange.value);

// Calcula puntaje
function scorePassword(pw){
  if(!pw) return 0;
  let score = 0;
  score += Math.min(40, Math.max(0, (pw.length - 6) * 4)); // longitud
  if(/[a-z]/.test(pw)) score += 10;
  if(/[A-Z]/.test(pw)) score += 12;
  if(/[0-9]/.test(pw)) score += 14;
  if(/[^A-Za-z0-9]/.test(pw)) score += 18;

  if(/password|123456|qwerty|abcdef/i.test(pw)) score = Math.min(score, 25);
  return Math.min(100, score);
}

function updateMeter(pw){
  const s = scorePassword(pw);
  meterBar.style.width = s + '%';
  pwLen.textContent = pw.length;

  if(s < 30) meterText.textContent = 'Calificación: Débil';
  else if(s < 60) meterText.textContent = 'Calificación: Moderada';
  else if(s < 85) meterText.textContent = 'Calificación: Fuerte';
  else meterText.textContent = 'Calificación: Muy fuerte';
}

// Comprobar
checkBtn.addEventListener('click', ()=> updateMeter(pwInput.value));

// Generar
function generatePassword(length=16){
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  const arr = new Uint32Array(length);
  window.crypto.getRandomValues(arr);
  return [...arr].map(n => charset[n % charset.length]).join('');
}

genBtn.addEventListener('click', ()=>{
  const len = parseInt(lenRange.value,10);
  const pw = generatePassword(len);
  pwInput.value = pw;
  updateMeter(pw);
});

// Copiar
copyBtn.addEventListener('click', async ()=>{
  try{
    await navigator.clipboard.writeText(pwInput.value);
    copyBtn.textContent = 'Copiado ✓';
    setTimeout(()=> copyBtn.textContent = 'Copiar',1400);
  }catch(e){
    copyBtn.textContent = 'Error';
    setTimeout(()=> copyBtn.textContent = 'Copiar',1400);
  }
});

// Mostrar/ocultar
toggleReveal.addEventListener('click', ()=>{
  if(pwInput.type === 'password'){
    pwInput.type = 'text';
    toggleReveal.textContent = 'Ocultar';
  } else {
    pwInput.type = 'password';
    toggleReveal.textContent = 'Mostrar';
  }
});

// En vivo
pwInput.addEventListener('input', ()=> updateMeter(pwInput.value));
updateMeter('');
