import '@repo/ui/styles.css'
import './globals.css'
import { createRoot } from 'react-dom/client'
import Page from './page'
import Stub from '@components/Stub'
const container = document.getElementById('app')

const root = createRoot(container as HTMLElement)

root.render(
    <>
        <Stub />
        <Page />
    </>
)
