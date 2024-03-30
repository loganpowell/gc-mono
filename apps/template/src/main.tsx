import '@repo/ui/styles.css'
import './main.css'
import { createRoot } from 'react-dom/client'
import Stub from '@components/Stub'
const container = document.getElementById('app')

const root = createRoot(container as HTMLElement)

root.render(
    <>
        <Stub />
    </>
)
