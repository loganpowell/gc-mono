import '@repo/ui/styles.css'
import './main.css'
import { createRoot } from 'react-dom/client'
import { Counter } from '@ui/counter'
import { Header } from '@ui/header'

const container = document.getElementById('app')

const root = createRoot(container as HTMLElement)

root.render(
    <>
        <Header title="Medic" />
        <Counter count={3} />
    </>
)
