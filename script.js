import * as THREE from 'three';

// =====================================================
// GALAXIA ESPIRAL 3D — ROTACIÓN COMPLETA
// =====================================================

const contenedor = document.getElementById('escena');
const botonInicio = document.getElementById('iniciar');
const pantallaInicio = document.getElementById('pantalla-inicio');

if (!contenedor) {
    throw new Error('No se encontró el elemento #escena');
}

// =====================================================
// ESCENA Y CÁMARA
// =====================================================

const escena = new THREE.Scene();
escena.background = new THREE.Color(0x000000);

const camara = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    300
);

camara.position.set(0, 0, 31);

const renderizador = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance'
});

renderizador.setSize(window.innerWidth, window.innerHeight);
renderizador.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, 1.75)
);

renderizador.outputColorSpace = THREE.SRGBColorSpace;
renderizador.toneMapping = THREE.ACESFilmicToneMapping;
renderizador.toneMappingExposure = 1.5;

contenedor.appendChild(renderizador.domElement);

// =====================================================
// GRUPO PRINCIPAL
// =====================================================

const galaxia = new THREE.Group();
escena.add(galaxia);

galaxia.rotation.x = 0.32;

// =====================================================
// TEXTURA DE LUZ
// =====================================================

function crearTexturaLuz() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;

    const ctx = canvas.getContext('2d');

    const gradiente = ctx.createRadialGradient(
        64, 64, 0,
        64, 64, 64
    );

    gradiente.addColorStop(0, 'rgba(255,255,255,1)');
    gradiente.addColorStop(0.12, 'rgba(255,255,255,0.9)');
    gradiente.addColorStop(0.35, 'rgba(255,255,255,0.35)');
    gradiente.addColorStop(1, 'rgba(255,255,255,0)');

    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, 128, 128);

    const textura = new THREE.CanvasTexture(canvas);
    textura.colorSpace = THREE.SRGBColorSpace;

    return textura;
}

const texturaLuz = crearTexturaLuz();

// =====================================================
// ESTRELLAS DE FONDO
// =====================================================

function crearEstrellas(cantidad) {
    const posiciones = new Float32Array(cantidad * 3);
    const colores = new Float32Array(cantidad * 3);

    const paleta = [
        new THREE.Color(0xffffff),
        new THREE.Color(0xb8c9ff),
        new THREE.Color(0xffd9e9),
        new THREE.Color(0xc9aaff)
    ];

    for (let i = 0; i < cantidad; i++) {
        const k = i * 3;

        posiciones[k] = (Math.random() - 0.5) * 120;
        posiciones[k + 1] = (Math.random() - 0.5) * 85;
        posiciones[k + 2] = -15 - Math.random() * 65;

        const color = paleta[
            Math.floor(Math.random() * paleta.length)
        ];

        colores[k] = color.r;
        colores[k + 1] = color.g;
        colores[k + 2] = color.b;
    }

    const geometria = new THREE.BufferGeometry();

    geometria.setAttribute(
        'position',
        new THREE.BufferAttribute(posiciones, 3)
    );

    geometria.setAttribute(
        'color',
        new THREE.BufferAttribute(colores, 3)
    );

    const material = new THREE.PointsMaterial({
        size: 0.28,
        map: texturaLuz,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const estrellas = new THREE.Points(geometria, material);
    escena.add(estrellas);

    return estrellas;
}

const estrellasFondo = crearEstrellas(2500);

// =====================================================
// BRAZOS ESPIRALES
// =====================================================

function crearBrazosEspirales() {
    const cantidad = 18000;
    const numeroBrazos = 4;

    const posiciones = new Float32Array(cantidad * 3);
    const colores = new Float32Array(cantidad * 3);

    const colorCentro = new THREE.Color(0xffd69a);
    const colorInterior = new THREE.Color(0xffa6ce);
    const colorVioleta = new THREE.Color(0x9855ff);
    const colorAzul = new THREE.Color(0x397aff);

    for (let i = 0; i < cantidad; i++) {
        const k = i * 3;

        const brazo = i % numeroBrazos;
        const radio = 0.5 + Math.pow(Math.random(), 0.72) * 12;

        const desviacion = (Math.random() - 0.5) *
            (0.18 + radio * 0.045);

        const angulo =
            brazo * Math.PI * 2 / numeroBrazos +
            radio * 0.52 +
            desviacion;

        posiciones[k] = Math.cos(angulo) * radio;
        posiciones[k + 1] =
            Math.sin(angulo) * radio * 0.85;

        posiciones[k + 2] =
            (Math.random() - 0.5) *
            (0.15 + radio * 0.10);

        let color;

        if (radio < 3) {
            color = colorCentro.clone().lerp(
                colorInterior,
                Math.random() * 0.55
            );
        } else if (radio < 7) {
            color = colorInterior.clone().lerp(
                colorVioleta,
                Math.random() * 0.65
            );
        } else {
            color = colorVioleta.clone().lerp(
                colorAzul,
                Math.random() * 0.8
            );
        }

        const brillo = 0.65 + Math.random() * 0.8;

        colores[k] = Math.min(color.r * brillo, 1);
        colores[k + 1] = Math.min(color.g * brillo, 1);
        colores[k + 2] = Math.min(color.b * brillo, 1);
    }

    const geometria = new THREE.BufferGeometry();

    geometria.setAttribute(
        'position',
        new THREE.BufferAttribute(posiciones, 3)
    );

    geometria.setAttribute(
        'color',
        new THREE.BufferAttribute(colores, 3)
    );

    const material = new THREE.PointsMaterial({
        size: 0.19,
        map: texturaLuz,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const puntos = new THREE.Points(geometria, material);
    galaxia.add(puntos);

    return puntos;
}

const brazos = crearBrazosEspirales();

// =====================================================
// POLVO CÓSMICO
// =====================================================

function crearPolvo() {
    const cantidad = 7000;

    const posiciones = new Float32Array(cantidad * 3);
    const colores = new Float32Array(cantidad * 3);

    const paleta = [
        new THREE.Color(0x5124a8),
        new THREE.Color(0x8e36c9),
        new THREE.Color(0x354cbd),
        new THREE.Color(0xd34cae),
        new THREE.Color(0x9a70e8)
    ];

    for (let i = 0; i < cantidad; i++) {
        const k = i * 3;

        const radio = 2 + Math.random() * 11;
        const angulo = Math.random() * Math.PI * 2;

        posiciones[k] = Math.cos(angulo) * radio;
        posiciones[k + 1] =
            Math.sin(angulo) * radio * 0.85;

        posiciones[k + 2] =
            (Math.random() - 0.5) *
            (0.3 + radio * 0.12);

        const color = paleta[
            Math.floor(Math.random() * paleta.length)
        ];

        const brillo = 0.25 + Math.random() * 0.65;

        colores[k] = color.r * brillo;
        colores[k + 1] = color.g * brillo;
        colores[k + 2] = color.b * brillo;
    }

    const geometria = new THREE.BufferGeometry();

    geometria.setAttribute(
        'position',
        new THREE.BufferAttribute(posiciones, 3)
    );

    geometria.setAttribute(
        'color',
        new THREE.BufferAttribute(colores, 3)
    );

    const material = new THREE.PointsMaterial({
        size: 0.32,
        map: texturaLuz,
        vertexColors: true,
        transparent: true,
        opacity: 0.38,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const polvo = new THREE.Points(geometria, material);
    galaxia.add(polvo);

    return polvo;
}

const polvoCosmico = crearPolvo();

// =====================================================
// NEBULOSAS PROCEDURALES
// =====================================================

function crearTexturaNebulosa(colorCentro, colorExterior) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;

    const ctx = canvas.getContext('2d');

    const gradiente = ctx.createRadialGradient(
        128, 128, 5,
        128, 128, 128
    );

    gradiente.addColorStop(0, colorCentro);
    gradiente.addColorStop(0.25, colorCentro);
    gradiente.addColorStop(0.65, colorExterior);
    gradiente.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, 256, 256);

    for (let i = 0; i < 100; i++) {
        const x = Math.random() * 256;
        const y = Math.random() * 256;
        const radio = 5 + Math.random() * 28;

        ctx.beginPath();
        ctx.arc(x, y, radio, 0, Math.PI * 2);
        ctx.fillStyle = colorExterior;
        ctx.globalAlpha = Math.random() * 0.12;
        ctx.fill();
    }

    ctx.globalAlpha = 1;

    const textura = new THREE.CanvasTexture(canvas);
    textura.colorSpace = THREE.SRGBColorSpace;

    return textura;
}

const texturasNebulosas = [
    crearTexturaNebulosa(
        'rgba(160,80,255,0.38)',
        'rgba(75,25,180,0.08)'
    ),
    crearTexturaNebulosa(
        'rgba(255,90,190,0.32)',
        'rgba(140,30,160,0.08)'
    ),
    crearTexturaNebulosa(
        'rgba(65,130,255,0.34)',
        'rgba(30,60,180,0.08)'
    )
];

const grupoNebulosas = new THREE.Group();

for (let i = 0; i < 100; i++) {
    const brazo = i % 4;
    const radio = 3 + Math.random() * 9;

    const angulo =
        brazo * Math.PI / 2 +
        radio * 0.52 +
        (Math.random() - 0.5) * 0.7;

    const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
            map: texturasNebulosas[
                Math.floor(Math.random() * texturasNebulosas.length)
            ],
            transparent: true,
            opacity: 0.25 + Math.random() * 0.3,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
    );

    const tamano = 2 + Math.random() * 4;

    sprite.scale.set(tamano, tamano, 1);

    sprite.position.set(
        Math.cos(angulo) * radio,
        Math.sin(angulo) * radio * 0.85,
        (Math.random() - 0.5) * 1.5
    );

    grupoNebulosas.add(sprite);
}

galaxia.add(grupoNebulosas);
// =====================================================
// NÚCLEO GALÁCTICO Y MENSAJE CENTRAL
// =====================================================

function crearNucleo() {
    const grupo = new THREE.Group();

    const nucleo = new THREE.Mesh(
        new THREE.SphereGeometry(1.65, 64, 64),
        new THREE.MeshBasicMaterial({
            color: 0xffd49a
        })
    );

    grupo.add(nucleo);

    function crearEsferaLuminosa(radio, color, opacidad) {
        const esfera = new THREE.Mesh(
            new THREE.SphereGeometry(radio, 48, 48),
            new THREE.MeshBasicMaterial({
                color,
                transparent: true,
                opacity: opacidad,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            })
        );

        grupo.add(esfera);
    }

    crearEsferaLuminosa(1.95, 0xffa84b, 0.18);
    crearEsferaLuminosa(2.35, 0xff762c, 0.09);

    const halo = new THREE.Sprite(
        new THREE.SpriteMaterial({
            map: texturaLuz,
            color: 0xffbb72,
            transparent: true,
            opacity: 0.95,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
    );

    halo.scale.set(9, 9, 1);
    grupo.add(halo);

    const haloExterior = new THREE.Sprite(
        new THREE.SpriteMaterial({
            map: texturaLuz,
            color: 0xb65aff,
            transparent: true,
            opacity: 0.28,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
    );

    haloExterior.scale.set(17, 17, 5);
    grupo.add(haloExterior);

    // =================================================
    // MENSAJE CENTRAL EN DOS LÍNEAS
    // =================================================

    const canvasTitulo = document.createElement('canvas');
    canvasTitulo.width = 1200;
    canvasTitulo.height = 300;

    const ctxTitulo = canvasTitulo.getContext('2d');

    ctxTitulo.clearRect(0, 0, 1200, 300);

    ctxTitulo.textAlign = 'center';
    ctxTitulo.textBaseline = 'middle';
    ctxTitulo.fillStyle = '#fff0b5';
    ctxTitulo.shadowColor = '#ffb52e';
    ctxTitulo.shadowBlur = 22;

    ctxTitulo.font = 'bold 62px Arial';
    ctxTitulo.fillText(
        'TE AMO MI NOVIA HERMOSA',
        600,
        105
    );

    ctxTitulo.font = 'bold 78px Arial';
    ctxTitulo.fillText(
        'ALEXANDRA',
        600,
        205
    );

    const texturaTitulo = new THREE.CanvasTexture(canvasTitulo);
    texturaTitulo.colorSpace = THREE.SRGBColorSpace;

    const materialTitulo = new THREE.SpriteMaterial({
        map: texturaTitulo,
        transparent: true,
        depthWrite: false,
        depthTest: false
    });

    const tituloCentral = new THREE.Sprite(materialTitulo);

    tituloCentral.scale.set(9.2, 2.3, 1);
    tituloCentral.position.set(0, 0, 3.2);

    grupo.add(tituloCentral);

    galaxia.add(grupo);

    return grupo;
}

const nucleoGalactico = crearNucleo();

// =====================================================
// ESTRELLAS DENTRO DE LA GALAXIA
// =====================================================

function crearEstrellasGalacticas(cantidad) {
    const grupo = new THREE.Group();

    for (let i = 0; i < cantidad; i++) {
        const radio = 3 + Math.random() * 9;
        const brazo = Math.floor(Math.random() * 4);

        const angulo =
            brazo * Math.PI / 2 +
            radio * 0.52 +
            (Math.random() - 0.5) * 0.45;

        const estrella = new THREE.Sprite(
            new THREE.SpriteMaterial({
                map: texturaLuz,
                color: Math.random() > 0.5
                    ? 0x9abaff
                    : 0xffd8ef,
                transparent: true,
                opacity: 0.5 + Math.random() * 0.5,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            })
        );

        const tamano = 0.12 + Math.random() * 0.32;

        estrella.scale.set(tamano, tamano, 1);

        estrella.position.set(
            Math.cos(angulo) * radio,
            Math.sin(angulo) * radio * 0.85,
            (Math.random() - 0.5) * 1.2
        );

        grupo.add(estrella);
    }

    galaxia.add(grupo);

    return grupo;
}

const estrellasGalacticas = crearEstrellasGalacticas(350);

// =====================================================
// RAZONES POR LAS QUE TE AMO
// =====================================================

const razonesAmor = [
    "Porque tu sonrisa ilumina mis días",
    "Porque tus ojos tienen algo especial",
    "Porque me encanta tu forma de ser",
    "Porque eres única",
    "Porque me haces feliz",
    "Porque tu voz me tranquiliza",
    "Porque me encanta escucharte",
    "Porque haces especiales los momentos simples",
    "Porque contigo todo es diferente",
    "Porque pienso en ti sin darme cuenta",
    "Porque me inspiras a ser mejor",
    "Porque me encanta tu risa",
    "Porque tienes una manera especial de hacerme sonreír",
    "Porque eres mi pensamiento favorito",
    "Porque me gusta conocer cada detalle de ti",
    "Porque me encanta tu personalidad",
    "Porque tienes una luz especial",
    "Porque me haces sentir afortunado",
    "Porque eres importante para mí",
    "Porque me encanta hablar contigo",
    "Porque tus mensajes alegran mi día",
    "Porque me gusta saber cómo estás",
    "Porque me haces olvidar los días difíciles",
    "Porque me encanta tu manera de expresarte",
    "Porque eres una persona increíble",
    "Porque admiro tu forma de pensar",
    "Porque tienes un corazón especial",
    "Porque me gusta tu espontaneidad",
    "Porque hasta tus pequeños gestos me encantan",
    "Porque me encanta descubrir cosas nuevas de ti",
    "Porque me haces sentir cerca incluso estando lejos",
    "Porque tu felicidad también me importa",
    "Porque me gusta compartir mi tiempo contigo",
    "Porque haces que te extrañe de una manera bonita",
    "Porque me encanta cuando te emocionas",
    "Porque tienes una sonrisa inolvidable",
    "Porque me gusta tu sentido del humor",
    "Porque me haces sentir especial",
    "Porque contigo puedo ser yo mismo",
    "Porque me encanta tu dulzura",
    "Porque me gusta tu manera de ver el mundo",
    "Porque eres parte de mis pensamientos",
    "Porque me encanta tu entusiasmo",
    "Porque tienes detalles que no encuentro en nadie más",
    "Porque me gusta escucharte contar tus cosas",
    "Porque cada conversación contigo vale la pena",
    "Porque me encanta tu forma de mirar",
    "Porque me haces querer dar lo mejor de mí",
    "Porque eres una bonita coincidencia",
    "Porque me gusta imaginar momentos contigo",
    "Porque tu presencia alegra mi vida",
    "Porque me encanta cómo eres sin intentar cambiarte",
    "Porque tienes una belleza especial",
    "Porque me gusta tu manera de reír",
    "Porque me haces sonreír frente al teléfono",
    "Porque me encanta tu voz cuando estás feliz",
    "Porque me gusta conocer tus sueños",
    "Porque quiero verte cumplir tus metas",
    "Porque admiro tus esfuerzos",
    "Porque me gusta apoyarte",
    "Porque me importan tus sentimientos",
    "Porque quiero verte sonreír",
    "Porque me encanta cuando me cuentas tu día",
    "Porque cada momento contigo tiene algo especial",
    "Porque me gusta aprender de ti",
    "Porque haces que la distancia parezca más pequeña",
    "Porque me encanta tu forma de sorprenderme",
    "Porque tienes una esencia inolvidable",
    "Porque me gusta cómo eres con las personas",
    "Porque me encanta tu energía",
    "Porque me gusta tu manera de hablar",
    "Porque me haces valorar los pequeños momentos",
    "Porque eres una persona que quiero cuidar",
    "Porque me encanta tu sinceridad",
    "Porque me gusta compartir mis pensamientos contigo",
    "Porque siempre encuentro algo nuevo que admirar en ti",
    "Porque me encanta tu lado tierno",
    "Porque me gusta cuando eres espontánea",
    "Porque tienes una forma única de alegrarme",
    "Porque me encanta tu creatividad",
    "Porque me gusta escuchar tus opiniones",
    "Porque quiero conocer todos tus sueños",
    "Porque me encanta verte feliz",
    "Porque me haces sentir mariposas",
    "Porque eres alguien a quien elegiría conocer otra vez",
    "Porque me gusta la tranquilidad que me transmites",
    "Porque me encanta tu forma de ser conmigo",
    "Porque cada día encuentro algo que me gusta de ti",
    "Porque me gusta recordar nuestras conversaciones",
    "Porque me haces creer en las casualidades bonitas",
    "Porque me encanta tu manera de demostrar cariño",
    "Porque eres una persona que deja huella",
    "Porque me gusta imaginar nuevas aventuras contigo",
    "Porque me encanta cuando compartes tus alegrías",
    "Porque quiero estar presente en tus buenos momentos",
    "Porque me gusta conocerte cada día un poco más",
    "Porque eres mucho más de lo que imaginaba",
    "Porque tienes detalles que me hacen sonreír",
    "Porque me encanta tu forma de soñar",
    "Porque quiero celebrar tus logros",
    "Porque me gusta acompañarte en tus días difíciles",
    "Porque me encanta la confianza que podemos construir",
    "Porque me haces apreciar el cariño verdadero",
    "Porque me gusta tu manera de afrontar la vida",
    "Porque quiero seguir creando recuerdos contigo",
    "Porque me encanta cuando compartimos risas",
    "Porque tu existencia hace mi mundo más bonito",
    "Porque me gusta descubrir tus pequeños gustos",
    "Porque me encanta tu forma de ser auténtica",
    "Porque eres una persona que vale muchísimo",
    "Porque quiero seguir aprendiendo de ti",
    "Porque me gusta pensar en nuestro próximo encuentro",
    "Porque me encanta la emoción de volver a hablar contigo",
    "Porque cada detalle tuyo tiene algo especial",
    "Porque me gusta celebrar quién eres",
    "Porque me haces mirar las estrellas y pensar en ti",
    "Porque entre millones de estrellas te elegiría a ti"
];

// =====================================================
// CREAR MENSAJES AMARILLOS CON GIRASOLES
// =====================================================

function dibujarGirasol(ctx, x, y, tamano) {
    ctx.save();
    ctx.translate(x, y);

    // Pétalos amarillos
    for (let i = 0; i < 12; i++) {
        const angulo = (Math.PI * 2 * i) / 12;

        ctx.save();
        ctx.rotate(angulo);
        ctx.beginPath();
        ctx.ellipse(
            0, -tamano * 0.58,
            tamano * 0.19, tamano * 0.39,
            0, 0, Math.PI * 2
        );
        ctx.fillStyle = '#ffcf24';
        ctx.fill();
        ctx.restore();
    }

    // Centro marrón del girasol
    ctx.beginPath();
    ctx.arc(0, 0, tamano * 0.31, 0, Math.PI * 2);
    ctx.fillStyle = '#704018';
    ctx.fill();

    // Pequeños puntos en el centro
    ctx.fillStyle = '#d99a36';

    for (let i = 0; i < 9; i++) {
        const angulo = i * 2.4;
        const radio = tamano * 0.17;

        ctx.beginPath();
        ctx.arc(
            Math.cos(angulo) * radio,
            Math.sin(angulo) * radio,
            tamano * 0.035,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    ctx.restore();
}

function crearMensajeAmor(texto) {
    const canvas = document.createElement('canvas');

    canvas.width = 1024;
    canvas.height = 160;

    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Girasoles a ambos lados
    dibujarGirasol(ctx, 55, 80, 23);
    dibujarGirasol(ctx, 969, 80, 23);

    // Letras amarillas pequeñas
    ctx.fillStyle = '#ffd84d';
    ctx.font = 'bold 34px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#ffbf24';
    ctx.shadowBlur = 8;

    const anchoMaximo = 820;
    const palabras = texto.split(' ');
    const lineas = [];
    let linea = '';

    for (const palabra of palabras) {
        const prueba = linea ? linea + ' ' + palabra : palabra;

        if (ctx.measureText(prueba).width > anchoMaximo && linea) {
            lineas.push(linea);
            linea = palabra;
        } else {
            linea = prueba;
        }
    }

    if (linea) lineas.push(linea);

    const alturaLinea = 27;
    const inicioY = 80 - ((lineas.length - 1) * alturaLinea) / 2;

    lineas.forEach((textoLinea, i) => {
        ctx.fillText(
            textoLinea,
            512,
            inicioY + i * alturaLinea
        );
    });

    ctx.shadowBlur = 0;

    const textura = new THREE.CanvasTexture(canvas);
    textura.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.SpriteMaterial({
        map: textura,
        transparent: true,
        depthWrite: false,
        opacity: 0.95
    });

    const mensaje = new THREE.Sprite(material);
    mensaje.scale.set(5.0, 0.9, 1);

    return mensaje;
}

// =====================================================
// DISTRIBUIR MENSAJES POR LOS BRAZOS ESPIRALES
// =====================================================

const grupoMensajes = new THREE.Group();

razonesAmor.forEach((texto, i) => {
    const mensaje = crearMensajeAmor(texto);

    // Repartimos las frases de forma ordenada en cuatro brazos.
    // Cada brazo avanza hacia el exterior y gira gradualmente,
    // dejando espacio entre una frase y la siguiente.
    const brazo = i % 4;
    const paso = Math.floor(i / 4);

    const radio = 5.2 + paso * 0.28;

    const angulo =
        brazo * Math.PI / 2 +
        radio * 0.52 +
        paso * 0.72;

    // Una pequeña profundidad alternada ayuda a separar las frases
    // cuando se observa la galaxia desde distintos ángulos.
    const profundidad =
        ((paso % 3) - 1) * 0.42 +
        (brazo % 2) * 0.18;

    mensaje.position.set(
        Math.cos(angulo) * radio,
        Math.sin(angulo) * radio * 0.85,
        profundidad
    );

    grupoMensajes.add(mensaje);
});

galaxia.add(grupoMensajes);
// =====================================================
// 50 GIRASOLES GRANDES FLOTANDO POR LA GALAXIA
// =====================================================

function crearTexturaGirasolGrande() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;

    const ctx = canvas.getContext('2d');

    // Resplandor suave detrás de la flor
    const brillo = ctx.createRadialGradient(
        128, 128, 25,
        128, 128, 125
    );

    brillo.addColorStop(0, 'rgba(255,210,65,0.20)');
    brillo.addColorStop(1, 'rgba(255,180,30,0)');

    ctx.fillStyle = brillo;
    ctx.fillRect(0, 0, 256, 256);

    // Girasol grande
    dibujarGirasol(ctx, 128, 128, 78);

    const textura = new THREE.CanvasTexture(canvas);
    textura.colorSpace = THREE.SRGBColorSpace;

    return textura;
}

const texturaGirasolGrande = crearTexturaGirasolGrande();
const grupoGirasolesFlotantes = new THREE.Group();

for (let i = 0; i < 50; i++) {
    const material = new THREE.SpriteMaterial({
        map: texturaGirasolGrande,
        transparent: true,
        depthWrite: false,
        opacity: 0.96
    });

    const girasol = new THREE.Sprite(material);

    const angulo = Math.random() * Math.PI * 2;
    const radio = 5.0 + Math.random() * 9.0;

    const x = Math.cos(angulo) * radio;
    const y = Math.sin(angulo) * radio * 0.85;
    const z = (Math.random() - 0.5) * 4.5;

    const tamano = 0.75 + Math.random() * 0.55;

    girasol.scale.set(tamano, tamano, 1);
    girasol.position.set(x, y, z);

    girasol.userData = {
        posicionY: y,
        posicionX: x,
        fase: Math.random() * Math.PI * 2,
        velocidad: 0.45 + Math.random() * 0.65,
        amplitud: 0.18 + Math.random() * 0.28,
        giro: (Math.random() - 0.5) * 0.35
    };

    grupoGirasolesFlotantes.add(girasol);
}

galaxia.add(grupoGirasolesFlotantes);

// =====================================================
// CONTROLES DE ROTACIÓN 3D COMPLETA
// =====================================================

let arrastrando = false;
let ultimoX = 0;
let ultimoY = 0;

let velocidadX = 0;
let velocidadY = 0;

let zoomObjetivo = 31;

const ejeX = new THREE.Vector3(1, 0, 0);
const ejeY = new THREE.Vector3(0, 1, 0);
const ejeZ = new THREE.Vector3(0, 0, 1);

const rotacionTemporal = new THREE.Quaternion();

renderizador.domElement.style.touchAction = 'none';
renderizador.domElement.style.cursor = 'grab';

function girarGalaxia(eje, angulo) {
    if (Math.abs(angulo) < 0.000001) return;

    rotacionTemporal.setFromAxisAngle(eje, angulo);

    galaxia.quaternion.premultiply(rotacionTemporal);
    galaxia.quaternion.normalize();
}

// Presionar
renderizador.domElement.addEventListener('pointerdown', (evento) => {
    arrastrando = true;

    ultimoX = evento.clientX;
    ultimoY = evento.clientY;

    velocidadX = 0;
    velocidadY = 0;

    renderizador.domElement.style.cursor = 'grabbing';

    renderizador.domElement.setPointerCapture(evento.pointerId);
});

// Arrastrar
renderizador.domElement.addEventListener('pointermove', (evento) => {
    if (!arrastrando) return;

    const dx = evento.clientX - ultimoX;
    const dy = evento.clientY - ultimoY;

    const sensibilidad = 0.006;

    girarGalaxia(ejeY, dx * sensibilidad);
    girarGalaxia(ejeX, dy * sensibilidad);

    velocidadY = dx * 0.0007;
    velocidadX = dy * 0.0007;

    ultimoX = evento.clientX;
    ultimoY = evento.clientY;
});

// Soltar
function soltarMouse() {
    arrastrando = false;
    renderizador.domElement.style.cursor = 'grab';
}

renderizador.domElement.addEventListener('pointerup', soltarMouse);
renderizador.domElement.addEventListener('pointercancel', soltarMouse);

// Zoom con doble clic
renderizador.domElement.addEventListener('dblclick', () => {
    zoomObjetivo = zoomObjetivo === 31 ? 19 : 31;
});

// Zoom con rueda
renderizador.domElement.addEventListener('wheel', (evento) => {
    evento.preventDefault();

    zoomObjetivo += evento.deltaY * 0.015;

    zoomObjetivo = THREE.MathUtils.clamp(
        zoomObjetivo,
        15,
        48
    );
}, { passive: false });

// =====================================================
// ANIMACIÓN
// =====================================================

const reloj = new THREE.Clock();

let animacionActiva = true;

function animar() {
    if (!animacionActiva) return;

    requestAnimationFrame(animar);

    const delta = Math.min(reloj.getDelta(), 0.04);
    const tiempo = reloj.elapsedTime;

    // Movimiento suave de los 50 girasoles flotantes
    grupoGirasolesFlotantes.children.forEach((girasol) => {
        const datos = girasol.userData;

        girasol.position.y =
            datos.posicionY +
            Math.sin(
                tiempo * datos.velocidad + datos.fase
            ) * datos.amplitud;

        girasol.position.x =
            datos.posicionX +
            Math.cos(
                tiempo * datos.velocidad * 0.65 + datos.fase
            ) * 0.12;

        girasol.material.rotation += datos.giro * delta;
    });

    girarGalaxia(ejeZ, delta * 0.025);

    polvoCosmico.rotation.z -= delta * 0.012;
    grupoNebulosas.rotation.z += delta * 0.008;

    const pulso = 1 + Math.sin(tiempo * 1.3) * 0.025;
    nucleoGalactico.scale.setScalar(pulso);

    if (!arrastrando) {
        girarGalaxia(ejeX, velocidadX);
        girarGalaxia(ejeY, velocidadY);

        velocidadX *= 0.97;
        velocidadY *= 0.97;
    }

    camara.position.z +=
        (zoomObjetivo - camara.position.z) * 0.05;

    camara.lookAt(0, 0, 0);

    renderizador.render(escena, camara);
}

// =====================================================
// PAUSAR CUANDO LA PESTAÑA NO ESTÁ VISIBLE
// =====================================================

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        animacionActiva = false;
    } else if (!animacionActiva) {
        animacionActiva = true;
        reloj.getDelta();
        animar();
    }
});

// =====================================================
// ADAPTAR A LA VENTANA
// =====================================================

window.addEventListener('resize', () => {
    camara.aspect = window.innerWidth / window.innerHeight;
    camara.updateProjectionMatrix();

    renderizador.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderizador.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, 1.75)
    );
});

// =====================================================
// BOTÓN DE INICIO
// =====================================================

if (botonInicio && pantallaInicio) {
    botonInicio.addEventListener('click', () => {
        pantallaInicio.style.opacity = '0';

        setTimeout(() => {
            pantallaInicio.style.display = 'none';
        }, 2000);
    });
}

// =====================================================
// INICIAR
// =====================================================

animar();

console.log('GALAXIA 3D: rotación completa activada.');