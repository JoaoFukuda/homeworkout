import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { Typography, Card } from '@material-ui/core'
import PublishIcon from '@material-ui/icons/Publish'
import Header from '../components/Header'
import TextInput from '../components/TextInput'
import api from '../services/api'
import { useAlert } from '../contexts/alert'
import SvgIcon from '@material-ui/core/SvgIcon/SvgIcon'
import { uploadFile } from 'react-s3'
import LargeButton from '../components/LargeButton'
import config from '../utils/awsConfig'

type Teacher = {
  name: string
  image: string
  email: string
}

export default function LessonForm() {
  const history = useHistory()
  const { showAlert } = useAlert()

  const [teacher, setTeacher] = useState<Teacher>({ name: '', image: '', email: '' })
  const [name, setName] = useState(teacher.name)
  const [image, setImage] = useState(teacher.image)
  const [email] = useState(teacher.email)

  useEffect(() => {
    getCurrentTeacher().then(setTeacher)
  }, [])

  const handleCreateClass = async () => {
    try {
      await api.put('/current_teacher/0', {
        teacher: {
          name,
          image,
          email,
        },
      })
      showAlert('Informações atualizadas!')
      history.push('/')
    } catch {
      alert('Erro ao tentar atualizar informações!')
    }
  }

  const handleChange = event => {
    uploadFile(event.target.files[0], config)
      .then(({ location }) => setImage(location))
      .catch(err => console.error(err))
  }

  const classes = useStyles()

  return (
    <>
      <Header/>
      <Card className={classes.cardInfo}>
        <Typography variant='h3'>Suas informações</Typography>
        <TextInput
          name='Nome'
          label='Nome'
          onChange= {e => { setName(e.target.value) }}
          placeholder= 'Seu nome'
          value={name}
        />
        <input type='file'
          id='fileUploadButton'
          style={{ display: 'none' }}
          onChange={handleChange}
        />
        <label htmlFor={'fileUploadButton'}>
          <Button
            className={classes.button}
            color='primary'
            component='span'
            startIcon={
              <SvgIcon fontSize='small'>
                <PublishIcon />
              </SvgIcon>
            }
          >
            Escolha sua foto de perfil
          </Button>
        </label>
        <img src={image}/>
        <LargeButton
          color='primary'
          onClick={handleCreateClass}
        >
          Salvar Cadastro
        </LargeButton>
      </Card>
    </>
  )
}

const getCurrentTeacher = async () => {
  const { data } = await api.get('/current_teacher/0')
  return data
}

const useStyles = makeStyles(() =>
  createStyles({
    cardInfo: {
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem',
      alignItems: 'center',
      borderRadius: 15,
      margin: '4rem',
    },
    button: {
      marginTop: '0.8rem',
    },
  }),
)
