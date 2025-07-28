const componentStyles = {
    // button styles
    primaryButton: {
        background: `var(--primary-color)`,
        color: 'var(--secondary-color)',
    },
    secondaryButton: {
        background: `var(--secondary-color)`,
        color: 'white',
        border: 'none'
    },
    // input styles
    inputField: {
        border: '1px solid var(--border-color)',
        borderRadius: '10px',
        fontSize: '20px',
        width: '268.86px'
    }
}
//
export function ButtonComponent(label, icon, container, styleName, border, width, borderRadius, height, className){
    const button = document.createElement('button');
    const styles = componentStyles[styleName]
    button.className = 'btn';
    button.id = label
    Object.assign(button.style, styles);
    // button.style['background'] = styles['background'];
    button.style.border = border
    button.style.width = width
    button.style.borderRadius = borderRadius;
    button.style.height = height;
    button.innerHTML = `<img src="${icon}"> ${label}`;
    container = container || document.body
    button.className = className;
    container.appendChild(button);
}

export function InputComponent(type, placeholder, container, id){
    const input = document.createElement('input');
    input.type = type;
    input.placeholder = placeholder
    input.id = id;
    container = container;
    container.appendChild(input);
}

