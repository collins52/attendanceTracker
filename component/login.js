import { ButtonComponent } from "../components.js";
import { InputComponent } from "../components.js";
const div = document.getElementById('formDiv');

// div.appendChild(ButtonComponent('Submit', 'https://example.com/icon.png', div));

ButtonComponent('Submit', 'https://example.com/icon.png', div, 'primaryButton', 'none', '200px', '5px', '40px');
InputComponent('text', 'Enter your name', div, 'nameInput');
InputComponent('text', 'Enter your name', div, 'nameInput');
