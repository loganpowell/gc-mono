import { useState, useRef, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'

import { getVideos } from '@actions'

import './styles.css'

const API_URI = import.meta.env.API_URI
const Home = () => {
    //const [file, setFile] = useState(null)
    //const [metadata, setMetadata] = useState({})
    //const [uploadStatus, setUploadStatus] = useState(null)
    //@ts-ignore
    const { state, dispatch } = useOutletContext()
    //const fileInputRef = useRef(null)
    const [uploads, setUploads] = useState([])

    useEffect(() => {
        let ignore = false

        const setVids = async () => {
            const json = await getVideos(dispatch)

            const grouped = json.reduce((r, v) => {
                r[v.status] ||= []
                r[v.status].push(v)
                return r
            }, {})

            if (!ignore) setUploads(grouped)
        }

        setVids()

        return () => {
            ignore = true
        }
    }, [uploads.length])

    return (
        <div className="Home">
            <h1 className="title block">Hello {`${state.user?.profile?.name}`} blep</h1>
            <pre>{JSON.stringify(state, null, 2)} </pre>

            <h2 className="subtitle block uploads">Todos</h2>
            <div className="card pending">
                <div className="card-content">
                    <h2 className="title">Pending Approval</h2>
                    {/*{!uploads.pending?.length ? (
                        <div className="no-videos">No pending videos</div>
                    ) : (
                        uploads.pending?.map((u, index) => {
                            const metadata = JSON.parse(u.metadata)
                            console.log({ u, index })

                            return (
                                <div key={index} className="UploadedVideo">
                                    <div className="subtitle">{metadata.title}</div>
                                    <div className="video">
                                        <video
                                            src={`${API_URI}/v1/stream/${u.filename}`}
                                            controls
                                        />
                                        <button
                                            className="button"
                                            onClick={() => {
                                                fetch(`${API_URI}/v1/videos/${u.id}/approve`, {
                                                    method: 'POST',
                                                    credentials: 'include',
                                                }).then(() => {
                                                    setUploads(
                                                        uploads.pending.filter((v) => v.id !== u.id)
                                                    )
                                                })
                                            }}
                                        >
                                            Approve
                                        </button>
                                    </div>
                                </div>
                            )
                        })
                    )}*/}
                </div>
            </div>
        </div>
    )
}

export default Home
