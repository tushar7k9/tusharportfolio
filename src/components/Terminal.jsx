import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import './Terminal.css';

const COMMANDS = {
  help: () => [
    '',
    '  Available commands:',
    '',
    '    about        Who is Tushar?',
    '    skills       Technical skills & tools',
    '    experience   Work experience',
    '    projects     Featured projects',
    '    education    Education background',
    '    contact      Get in touch',
    '    whoami       Current user',
    '    pwd          Print working directory',
    '    ls           List available files',
    '    cat <file>   Read a file',
    '    clear        Clear the terminal',
    '    help         Show this help message',
    '',
  ],

  about: () => [
    '',
    '  Hey! I\'m Tushar — a full-stack developer passionate about',
    '  crafting beautiful, functional, and user-centered digital',
    '  experiences. I love building things that live on the internet,',
    '  from interactive websites to robust backend systems.',
    '',
    '  When I\'m not coding, you\'ll find me exploring new technologies,',
    '  solving problems on LeetCode, or working on side projects.',
    '',
    { type: 'jump', label: 'Go to About', sectionIndex: 1, color: '#9333ea' },
    '',
  ],

  skills: () => [
    '',
    '  Languages     JavaScript, TypeScript, Python, Java, C++',
    '  Frontend      React, Next.js, Tailwind CSS, Three.js',
    '  Backend       Node.js, Express, Django, REST APIs',
    '  Databases     PostgreSQL, MongoDB, Redis',
    '  DevOps        Docker, AWS, CI/CD, Git',
    '  Tools         VS Code, Figma, Linux, Postman',
    '',
    { type: 'jump', label: 'Go to Skills', sectionIndex: 2, color: '#4ecdc4' },
    '',
  ],

  experience: () => [
    '',
    '  ┌─────────────────────────────────────────────┐',
    '  │  Full-Stack Developer                        │',
    '  │  Building scalable web applications          │',
    '  │  and solving complex engineering problems.    │',
    '  └─────────────────────────────────────────────┘',
    '',
    { type: 'jump', label: 'Go to Experience', sectionIndex: 3, color: '#FF79C6' },
    '',
  ],

  projects: () => [
    '',
    '  ▸ Portfolio Website',
    '    Interactive portfolio with WebGL laser effects',
    '    and a terminal you\'re using right now!',
    '',
    '  ▸ More projects coming soon...',
    '    Check my GitHub for the latest work.',
    '',
  ],

  education: () => [
    '',
    '  🎓 B.Tech — Computer Science & Engineering',
    '     R&S Institute of Technology',
    '     2019 — 2023',
    '',
    '     Focused on algorithms, data structures,',
    '     software engineering, and system design.',
    '',
  ],

  contact: () => [
    '',
    '  Email     tushar7k9@gmail.com',
    '  GitHub    github.com/tushar7k9',
    '  LinkedIn  linkedin.com/in/tushar-ab0964213',
    '',
    '  Feel free to reach out!',
    '',
    { type: 'jump', label: 'Go to Contact', sectionIndex: 4, color: '#ff6b6b' },
    '',
  ],

  whoami: () => ['visitor'],

  pwd: () => ['/home/tushar/portfolio'],

  ls: () => [
    'about.txt    skills.txt    experience.txt',
    'projects.txt education.txt contact.txt',
  ],

  cat: (args) => {
    const file = args[0]?.replace('.txt', '');
    if (!file) return ['cat: missing operand. Usage: cat <file>'];
    if (COMMANDS[file] && file !== 'cat' && file !== 'clear' && file !== 'help') {
      return COMMANDS[file]([]);
    }
    return [`cat: ${args[0]}: No such file or directory`];
  },
};

const TYPING_SPEED = 60;
const INITIAL_DELAY = 800;
const AVAILABLE_COMMANDS = Object.keys(COMMANDS).concat('clear');

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';

const JumpButton = ({ label, sectionIndex, color }) => {
  const [display, setDisplay] = React.useState(label);
  const [active, setActive] = React.useState(false);
  const frameRef = React.useRef(null);
  const iterRef = React.useRef(0);

  const scramble = React.useCallback(() => {
    let iter = 0;
    clearInterval(frameRef.current);
    frameRef.current = setInterval(() => {
      setDisplay(
        label.split('').map((char, i) => {
          if (char === ' ') return ' ';
          if (i < iter) return label[i];
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }).join('')
      );
      iter += 0.6;
      if (iter >= label.length) {
        clearInterval(frameRef.current);
        setDisplay(label);
      }
    }, 30);
  }, [label]);

  React.useEffect(() => () => clearInterval(frameRef.current), []);

  return (
    <button
      className={`terminal-jump-btn ${active ? 'jump-active' : ''}`}
      style={{ '--jump-color': color }}
      onMouseEnter={() => { setActive(true); scramble(); }}
      onMouseLeave={() => { setActive(false); setDisplay(label); clearInterval(frameRef.current); }}
      onClick={(e) => {
        e.stopPropagation();
        const section = document.querySelectorAll('.page-section')[sectionIndex];
        if (section) section.scrollIntoView({ behavior: 'smooth' });
      }}
    >
      <span className="jump-arrow">⬡</span>
      <span className="jump-label">{display}</span>
      <span className="jump-chevron">→</span>
    </button>
  );
};

const Terminal = () => {
  const [history, setHistory] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTypingAnimation, setIsTypingAnimation] = useState(true);
  const [animatedInput, setAnimatedInput] = useState('');

  const inputRef = useRef(null);
  const bodyRef = useRef(null);
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const scrollToBottom = useCallback(() => {
    const body = bodyRef.current;
    if (body) {
      requestAnimationFrame(() => {
        body.scrollTop = body.scrollHeight;
      });
    }
  }, []);

  const executeCommand = useCallback((input) => {
    const trimmed = input.trim();
    if (!trimmed) {
      setHistory((prev) => [...prev, { type: 'input', content: '' }]);
      return;
    }

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (cmd === 'clear') {
      setHistory([]);
      return;
    }

    const handler = COMMANDS[cmd];
    const output = handler
      ? handler(args)
      : [`command not found: ${cmd}. Type "help" for available commands.`];

    setHistory((prev) => [
      ...prev,
      { type: 'input', content: trimmed },
      { type: 'output', content: output },
    ]);

    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);
  }, []);

  // Initial typing animation
  useEffect(() => {
    if (prefersReducedMotion.current) {
      executeCommand('help');
      setIsTypingAnimation(false);
      return;
    }

    const helpText = 'help';
    let charIndex = 0;
    let timeoutId;

    const typeNextChar = () => {
      if (charIndex < helpText.length) {
        setAnimatedInput(helpText.slice(0, charIndex + 1));
        charIndex++;
        timeoutId = setTimeout(typeNextChar, TYPING_SPEED);
      } else {
        timeoutId = setTimeout(() => {
          executeCommand('help');
          setAnimatedInput('');
          setIsTypingAnimation(false);
        }, 300);
      }
    };

    timeoutId = setTimeout(typeNextChar, INITIAL_DELAY);
    return () => clearTimeout(timeoutId);
  }, [executeCommand]);

  // Auto-scroll on history change
  useEffect(() => {
    scrollToBottom();
  }, [history, animatedInput, scrollToBottom]);

  const focusInput = useCallback(() => {
    if (!isTypingAnimation) {
      inputRef.current?.focus();
    }
  }, [isTypingAnimation]);

  const handleKeyDown = useCallback(
    (e) => {
      if (isTypingAnimation) return;

      switch (e.key) {
        case 'Enter': {
          executeCommand(currentInput);
          setCurrentInput('');
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          if (commandHistory.length === 0) return;
          const newIndex =
            historyIndex === -1
              ? commandHistory.length - 1
              : Math.max(0, historyIndex - 1);
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
          break;
        }
        case 'ArrowDown': {
          e.preventDefault();
          if (historyIndex === -1) return;
          const newIndex = historyIndex + 1;
          if (newIndex >= commandHistory.length) {
            setHistoryIndex(-1);
            setCurrentInput('');
          } else {
            setHistoryIndex(newIndex);
            setCurrentInput(commandHistory[newIndex]);
          }
          break;
        }
        case 'Tab': {
          e.preventDefault();
          if (!currentInput) return;
          const matches = AVAILABLE_COMMANDS.filter((cmd) =>
            cmd.startsWith(currentInput.toLowerCase())
          );
          if (matches.length === 1) {
            setCurrentInput(matches[0]);
          }
          break;
        }
        case 'l': {
          if (e.ctrlKey) {
            e.preventDefault();
            setHistory([]);
          }
          break;
        }
        case 'c': {
          if (e.ctrlKey) {
            e.preventDefault();
            setHistory((prev) => [
              ...prev,
              { type: 'input', content: currentInput + '^C' },
            ]);
            setCurrentInput('');
          }
          break;
        }
        default:
          break;
      }
    },
    [isTypingAnimation, currentInput, commandHistory, historyIndex, executeCommand]
  );

  const promptElement = useMemo(
    () => (
      <span className="terminal-prompt">
        <span className="prompt-user">visitor</span>
        <span className="prompt-at">@</span>
        <span className="prompt-host">tushar.dev</span>
        <span className="prompt-separator"> ~ </span>
        <span className="prompt-dollar">$</span>
      </span>
    ),
    []
  );

  return (
    <div className="terminal" onClick={focusInput}>
      {/* Title Bar */}
      <div className="terminal-titlebar">
        <div className="terminal-dots" aria-hidden="true">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <div className="terminal-title">visitor@tushar.dev</div>
        <div className="terminal-dots-spacer" />
      </div>

      {/* Terminal Body */}
      <div
        className="terminal-body"
        ref={bodyRef}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
      >
        {/* Welcome message */}
        <div className="terminal-line terminal-welcome">
          Welcome to Tushar's portfolio terminal. Type "help" to get started.
        </div>

        {/* History */}
        {history.map((entry, i) =>
          entry.type === 'input' ? (
            <div key={i} className="terminal-line">
              {promptElement}
              <span className="terminal-input-text">{entry.content}</span>
            </div>
          ) : (
            <div key={i} className="terminal-output">
              {entry.content.map((line, j) =>
                line && typeof line === 'object' && line.type === 'jump' ? (
                  <div key={j} className="terminal-line output-line">
                    <JumpButton label={line.label} sectionIndex={line.sectionIndex} color={line.color} />
                  </div>
                ) : (
                  <div key={j} className="terminal-line output-line">
                    {line}
                  </div>
                )
              )}
            </div>
          )
        )}

        {/* Typing animation or active input */}
        <div className="terminal-line terminal-active-line">
          {promptElement}
          {isTypingAnimation ? (
            <span className="terminal-input-text">
              {animatedInput}
              <span className="terminal-cursor" />
            </span>
          ) : (
            <>
              <span className="terminal-input-text">{currentInput}</span>
              <span className="terminal-cursor" />
            </>
          )}
        </div>

        {/* Hidden input for keyboard capture */}
        <input
          ref={inputRef}
          type="text"
          className="terminal-hidden-input"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Terminal input"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export default Terminal;
