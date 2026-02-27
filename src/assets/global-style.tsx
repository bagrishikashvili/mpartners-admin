import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  :root {
    --white: #fff;
    --black: #000;
    --meddium-green: #C3E1D2;
    --light-green: #EAF5EB;
    --success-green: #77B448;
    --green: #339966;
    --red: #C54343;
    --dark-green: #1F6B45;
    --dark-gray: #676767;
    --gray: #F8F8F8;
    --footer-dark: #00101A;
    --orange: #FF9933;
    --pink: #FDEDEE;
    --light-red: #F46A6A;
    --light-orange: #FCF2E4;
    --header-color:  #fff;
    --facebook: #2867b2;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    vertical-align: baseline;
    font: inherit;
  }

  fieldset {
    display: block;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-block-start: 0em;
    padding-inline-start: 0em;
    padding-inline-end: 0em;
    padding-block-end: 0em;
    min-inline-size: min-content;
    border-width: 0px;
    border-style: groove;
    border-color: rgb(192, 192, 192);
    border-image: initial;
}

legend {
    display: block;
    padding-inline-start: 0px;
    padding-inline-end: 0px;
    border-width: initial;
    border-style: none;
    border-color: initial;
    border-image: initial;
}
  
  .grecaptcha-badge { visibility: hidden; }

  /*** main styles **/
  html,
  body {
    background-color: rgb(241 241 241);
    height: 100%;
    font-size: 14px;
    font-family: 'Plus Jakarta Sans', 'BPG Arial', Helvetica, sans-serif;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
  img {
    max-width: 100%;
    display: inline-block;
  }
  ul {
    list-style: none;
  }
  input,
  button{
    outline: none;
  }
  h4 {
    font-family: 'Plus Jakarta Sans', Helvetica, sans-serif;
  }

  h1 {
    font-family: 'Plus Jakarta Sans', 'BPG Arial Caps', Helvetica, sans-serif;
  }

  h2 {
    font-family: 'Plus Jakarta Sans', 'BPG Arial', Helvetica, sans-serif;
  }

  .w-100{
    width: 100%;
  }

  .h-100{
    height: 100%;
  }

  .rotated{
    transform: rotate(180deg);
  }

  .text-center{
    text-align: center
  }

  .btn{
    display: block;
    border-radius: 4px;
    padding: 10px;
    border: none;
    outline: none !important;
    transition: background 0.25s;
    cursor: pointer;
  }

  .btn-green{
    background: var(--green);
    color: #fff;

    &:hover{
      background: var(--dark-green);
    }
  }

  textarea {
    font-family: 'Plus Jakarta Sans', 'BPG Arial', Helvetica, sans-serif;
  }

  /** Flex Classes **/
  .d-flex{
    display: flex !important;
  }

  .justify-content-center{
    justify-content: center !important;
  }

  .align-items-center{
    align-items: center !important;
  }

  .error-overlay-list{
    list-style-type: circle;
    padding-left: 20px;
  }

  .loading-indicator{
    min-height: 30px;
    margin-top: -3px;
    circle{
      stroke: var(--green)
    }
  }
  .form_control {
    font-family: 'Plus Jakarta Sans', 'BPG Arial', Helvetica, sans-serif;
      font-weight: 400;
      font-size: 1rem;
      line-height: 1.4375em;
      color: rgba(0, 0, 0, 0.87);
      box-sizing: border-box;
      position: relative;
      cursor: text;
      display: -webkit-inline-box;
      display: -webkit-inline-flex;
      display: -ms-inline-flexbox;
      display: inline-flex;
      -webkit-align-items: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      width: 100%;
      height: 50px;
      padding: 0 13px;
      border-radius: 4px;
      border: 1px solid #D6D6D6;
      background-color: #FFF;
      &:hover {
        border: 1px solid #F3742D;
      }

      &:focus {
        border: 1px solid #F3742D;
      }

      &:active {
        border: 1px solid #F3742D;
      }
      &::placeholder {
        color: #a2a2a2;
        opacity: 1; /* Firefox */
      }

      &::-ms-input-placeholder { /* Edge 12 -18 */
        color: #a2a2a2;
      }
  }
  .form_error {
    border: 1px solid #C54343;
  }
  .MuiPopover-paper {
    background-color: #fff;
    color: #1E2932;
    font-family: 'Plus Jakarta Sans', 'BPG Arial', 'Helvetica', 'sans-serif';
    font-size: 12px;
    padding: 6px;
    border-radius: 5px;
  }
  .MuiDataGrid-columnHeader:focus, .MuiDataGrid-cell:focus {
      outline: solid #F3742D 0px;
    }

    .MuiDataGrid-columnHeader:focus-within, .MuiDataGrid-cell:focus-within {
      outline: solid rgba(243, 116, 45, 0.5) 0px;
      outline-width: 1px;
      outline-offset: -1px;
    }
`;



export default GlobalStyles;