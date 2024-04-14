import React from 'react';
import styles from './Login.module.scss';

const Login = () => (
  <div className={styles.netflixLogin}>
    <form className={styles.loginForm}>
      <h1>Inicia sesión</h1>
      <input type="text" placeholder="Email o número de teléfono" />
      <input type="password" placeholder="Contraseña" />
      <button type="submit">Iniciar sesión</button>
      <div className={styles.signUp}>
        ¿Primera vez en Netflix? <a href="#">Crea una cuenta.</a>
      </div>
      <div className={styles.recaptcha}>
        Esta página está protegida por Google reCAPTCHA para comprobar que no eres un robot.
        <a href="#">Más info</a>.
      </div>
    </form>
  </div>
);

export default Login;
