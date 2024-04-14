import React, { useState, useEffect } from 'react'
import { set } from 'mongoose'
import styles from './SignUp.module.scss'

const SignUp = () => {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [gender, setGender] = useState('male')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [languagesAvailable, setLanguagesAvailable] = useState(['es', 'en', 'fr', 'de', 'it', 'pt'])
  const [selectedLanguages, setSelectedLanguages] = useState([])

  const [languagesSince, setLanguagesSince] = useState({})
  const [languagesLevel, setLanguagesLevel] = useState({})
  const [languagesNative, setLanguagesNative] = useState({})

  const [countriesAvailable, setCountriesAvailable] = useState(['es', 'en', 'fr', 'de', 'it', 'pt'])
  const [selectedCountries, setSelectedCountries] = useState([])

  const [countriesSince, setCountriesSince] = useState({})
  const [countriesUntil, setCountriesUntil] = useState({})
  const [countriesCity, setCountriesCity] = useState({})

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1)
  }

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1)
  }

  useEffect(() => {
    console.log('languagesSince', languagesSince)
  }, [languagesSince])

  return (
    <div className={styles.signup}>
      <div className={styles.signupModal}>
        {step === 1 && (
        <div className={styles.step}>
          <label htmlFor="name">Nombre Completo</label>
          <input
            type="text"
            id="name"
            placeholder="Nombre Completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={nextStep}>Siguiente</button>
          <button onClick={prevStep}>Cancelar</button>
        </div>
        )}

        {step === 2 && (
        <div className={styles.step}>
          <label htmlFor="birthdate">Fecha de Nacimiento</label>
          <input
            type="date"
            id="birthdate"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
          />
          <button onClick={nextStep}>Siguiente</button>
          <button onClick={prevStep}>Atrás</button>
        </div>
        )}

        {step === 3 && (
        <div className={styles.step}>
          <label htmlFor="gender">Género</label>
          <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="male">Masculino</option>
            <option value="female">Femenino</option>
          </select>
          <button onClick={nextStep}>Siguiente</button>
          <button onClick={prevStep}>Atrás</button>
        </div>
        )}

        {step === 4 && (
        <div className={styles.step}>
          <label htmlFor="username">Nombre de Usuario</label>
          <input
            type="text"
            id="username"
            placeholder="Nombre de Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={nextStep}>Siguiente</button>
          <button onClick={prevStep}>Atrás</button>
        </div>
        )}

        {step === 5 && (
        <div className={styles.step}>
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={nextStep}>Siguiente</button>
          <button onClick={prevStep}>Atrás</button>
        </div>
        )}
        {step === 6 && (
        <div className={styles.step}>
          <h1>Lenguajes hablados</h1>
          <div className={styles.languageCheckbox}>
            {languagesAvailable.map((language) => (
              <label key={language}>
                <input
                  type="checkbox"
                  value={language}
                  checked={selectedLanguages.includes(language)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedLanguages((prevLanguages) => [...prevLanguages, language])
                      setLanguagesSince((prevLanguagesSince) => ({ ...prevLanguagesSince, [language]: '' }))
                      setLanguagesLevel((prevLanguagesLevel) => ({ ...prevLanguagesLevel, [language]: '' }))
                      setLanguagesNative((prevLanguagesNative) => ({ ...prevLanguagesNative, [language]: false }))
                    } else {
                      setSelectedLanguages((prevLanguages) => prevLanguages.filter((lang) => lang !== language))
                      setLanguagesSince((prevLanguagesSince) => {
                        const { [language]: _, ...rest } = prevLanguagesSince
                        return rest
                      })
                      setLanguagesLevel((prevLanguagesLevel) => {
                        const { [language]: _, ...rest } = prevLanguagesLevel
                        return rest
                      })
                      setLanguagesNative((prevLanguagesNative) => {
                        const { [language]: _, ...rest } = prevLanguagesNative
                        return rest
                      })
                    }
                  }}
                />
                {language}
              </label>
            ))}
          </div>
          <button onClick={nextStep}>Siguiente</button>
          <button onClick={prevStep}>Atrás</button>
        </div>
        )}
        {step === 7 && (
        <div className={styles.step}>
          <h1>Lenguajes hablados</h1>
          <div>
            {selectedLanguages.map((language) => (
              <div className={styles.languages}>
                <p key={language}>{language}</p>
                <div>
                  <label>¿Desde cuándo hablas este idioma?</label>
                  <input
                    type="date"
                    value={languagesSince[language]}
                    onChange={(e) => setLanguagesSince((prevLanguagesSince) => (
                      { ...prevLanguagesSince, [language]: e.target.value }
                    ))}
                  />
                </div>
                <div>
                  <label>¿Cuál es tu nivel de este idioma?</label>
                  <input
                    type="number"
                    value={languagesLevel[language]}
                    onChange={(e) => setLanguagesLevel((prevLanguagesLevel) => (
                      { ...prevLanguagesLevel, [language]: e.target.value }
                    ))}
                  />
                </div>
                <div>
                  <label>¿Es tu idioma nativo?</label>
                  <input
                    type="checkbox"
                    checked={languagesNative[language]}
                    onChange={(e) => setLanguagesNative((prevLanguagesNative) => (
                      { ...prevLanguagesNative, [language]: e.target.checked }
                    ))}
                  />
                </div>
              </div>
            ))}
          </div>
          <button onClick={nextStep}>Siguiente</button>
          <button onClick={prevStep}>Atrás</button>
        </div>
        )}
        {step === 8 && (
        <div className={styles.step}>
          <h1>Paises visitados</h1>
          <div className={styles.languageCheckbox}>
            {countriesAvailable.map((country) => (
              <label key={country}>
                <input
                  type="checkbox"
                  value={country}
                  checked={selectedCountries.includes(country)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCountries((prevCountries) => [...prevCountries, country])
                      setCountriesSince((prevCountriesSince) => ({ ...prevCountriesSince, [country]: '' }))
                      setCountriesUntil((prevCountriesUntil) => ({ ...prevCountriesUntil, [country]: '' }))
                      setCountriesCity((prevCountriesCity) => ({ ...prevCountriesCity, [country]: '' }))
                    } else {
                      setSelectedCountries((prevCountries) => prevCountries.filter((lang) => lang !== country))
                      setCountriesSince((prevCountriesSince) => {
                        const { [country]: _, ...rest } = prevCountriesSince
                        return rest
                      })
                      setCountriesUntil((prevCountriesUntil) => {
                        const { [country]: _, ...rest } = prevCountriesUntil
                        return rest
                      })
                      setCountriesCity((prevCountriesCity) => {
                        const { [country]: _, ...rest } = prevCountriesCity
                        return rest
                      })
                    }
                  }}
                />
                {country}
              </label>
            ))}
          </div>
          <button onClick={nextStep}>Siguiente</button>
          <button onClick={prevStep}>Atrás</button>
        </div>
        )}
        {step === 9 && (
        <div className={styles.step}>
          <h1>Paises visitados</h1>
          <div>
            {selectedCountries.map((country) => (
              <div className={styles.languages}>
                <p key={country}>{country}</p>
                <div>
                  <label>¿Desde cuándo visitaste este país?</label>
                  <input
                    type="date"
                    value={countriesSince[country]}
                    onChange={(e) => setCountriesSince((prevCountriesSince) => (
                      { ...prevCountriesSince, [country]: e.target.value }
                    ))}
                  />
                </div>
                <div>
                  <label>¿Hasta cuándo visitaste este país?</label>
                  <input
                    type="date"
                    value={countriesUntil[country]}
                    onChange={(e) => setCountriesUntil((prevCountriesUntil) => (
                      { ...prevCountriesUntil, [country]: e.target.value }
                    ))}
                  />
                </div>
                <div>
                  <label>¿En qué ciudad estuviste?</label>
                  <input
                    type="text"
                    value={countriesCity[country]}
                    onChange={(e) => setCountriesCity((prevCountriesCity) => (
                      { ...prevCountriesCity, [country]: e.target.value }
                    ))}
                  />
                </div>
              </div>
            ))}
          </div>
          <button onClick={nextStep}>Siguiente</button>
          <button onClick={prevStep}>Atrás</button>
        </div>
        )}
      </div>
    </div>
  )
}

export default SignUp
