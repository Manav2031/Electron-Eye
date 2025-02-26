import { createGlobalStyle } from 'styled-components';
import '@fontsource/akaya-telivigala';
// Supports weights 100-800
import '@fontsource-variable/sora';

const GlobalStyles = createGlobalStyle`
*,*::beforeAll,*::after{
    margin:0;
    padding:0;
    text-decoration:none;
}

body{
    font-family:'Sora',sans-serif;
    overflow-x: hidden;
}

h1,h2,h3,h4,h5,h6{
    margin:0;
    padding:0;
}
a{
    color:inherit;
    text-decoration:none;
}
`;

export default GlobalStyles;
