
(function() {
  const cfg = getConfig();
  const powerBtn = document.querySelector('.power');
  const startBtn = document.querySelector('.start');
  const strictBtn = document.querySelector('.strict');
  const countDisplay = document.querySelector('.count')

  let isOn = false;
  let strictMode = false;
  let rounds = 0;
  let sequence = [];
  let userSequence = [];

  function startGame() {
    if (!isOn) return;

    userSequence = [];
    rounds = 0;
    sequence = [];
    newRound();
  }

  function newRound() {
    rounds++;
    userSequence = [];
    countDisplay.innerText = rounds.toString().padStart(2, '0');
    sequence.push(getRandomNumber());
    playSequence();
    addListeners();
  }

  function handleClick(e, val) {
    let num = cfg.map[e.target.id];
    userSequence.push(num);

    const compareTo = sequence.slice(0, userSequence.length);

    if (userSequence.join('') !== compareTo.join('')) {
      playItem(cfg.err);
      if (strictMode) return startGame();
      
      userSequence = [];
      setTimeout(playSequence, 500);
      return;
    }

    item = cfg[num];
    playItem(item);

    if (userSequence.length === sequence.length) {
      newRound();
    }
  }

  function powerOn() {
    if (isOn) return powerOff();
    isOn = true;
    countDisplay.innerText = '--';
    powerBtn.innerText = 'ON';
    powerBtn.classList.add('power-on');
    startBtn.addEventListener('click', startGame, false);
    strictBtn.addEventListener('click', toggleStrict, false);
  }

  function powerOff() {
    isOn = false;
    countDisplay.innerText = '';
    powerBtn.innerText = 'OFF'
    powerBtn.classList.remove('power-on');
    startBtn.removeEventListener('click', startGame, false);
    strictBtn.removeEventListener('click', toggleStrict, false);

    removeListeners();
  }

  function toggleStrict() {
    strictMode = !strictMode;

    if (strictMode) {
      strictBtn.classList.add('strict-on');
    } else {
      strictBtn.classList.remove('strict-on');
    }
  }

  function addListeners() {
    let props = Object.getOwnPropertyNames(cfg);
    props.forEach(x => {
      if (cfg[x].el) {
        cfg[x].el.addEventListener('click', handleClick, false);
      }
    })
  }

  function removeListeners() {
    let props = Object.getOwnPropertyNames(cfg);
    props.forEach(x => {
      if (cfg[x].el) {
        cfg[x].el.removeEventListener('click', handleClick, false);
      }
    })
  }

  function playSequence() {
    let idx = 1;
    sequence.forEach(x => {
      setTimeout(() => {
        playItem(cfg[x])
      }, 1000 * idx++);
    })
  }

  function playItem(item) {
    item.sound.play();
    if (item.el) {
      item.el.classList.add('light-up');
      setTimeout(removeHiglightCB(item), 500);
    }
  }

  function removeHiglightCB(item) {
    return () => item.el.classList.remove('light-up');
  }

  function getRandomNumber() {
    return Math.floor(Math.random() * 4) + 1;
  }

  function getConfig() {
    return {
      1: {
        color: 'green',
        el: document.querySelector('#green'),
        sound: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3')
      },
      2: {
        color: 'red',
        el: document.querySelector('#red'),
        sound: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3')
      },
      3: {
        color: 'yellow',
        el: document.querySelector('#yellow'),
        sound: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3')
      },
      4: {
        color: 'blue',
        el: document.querySelector('#blue'),
        sound: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
      },
      err: {
        sound: new Audio('http://www.kobusviljoen.co.za/static/buzzer.mp3')
      },
      map: {
        'green': 1,
        'red': 2,
        'yellow': 3,
        'blue': 4
      }
    }
  }

  powerBtn.addEventListener('click', powerOn, false);
})();
