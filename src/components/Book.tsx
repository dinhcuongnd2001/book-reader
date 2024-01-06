import React, { useEffect, useRef, useState } from 'react'
import SettingsBook from './SettingsBook/SettingsBook'
import { useAppDispatch, useAppSelector } from '../hooks/hooks'
import type { Contents, Rendition, NavItem } from 'epubjs'
import { ReactReader, ReactReaderStyle, type IReactReaderStyle, } from 'react-reader';
import { getLocalStorage } from '../utils/getLocalStorage';
import { ITheme, bookSliceActions } from '../store/Book/bookSlice';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const updateTheme = (rendition: Rendition, theme: ITheme) => {
    const themes = rendition.themes
    switch (theme) {
        case 'dark': {
            themes.override('color', '#F5F5F5')
            themes.override('background', '#333333')
            break
        }
        case 'light': {
            themes.override('color', '#000')
            themes.override('background', '#fff')
            break
        }
    }
}


const Book = () => {
    const { id, userId, position } = useParams<{ id: string, userId: string, position: string }>();
    const dispatch = useAppDispatch();

    const [bookUrl, setBookUrl] = useState<string>('');
    const [page, setPage] = useState('')
    const [rendition, setRendition] = useState<Rendition | undefined>(undefined);
    const [location, setLocation] = useState<string | number>(window.localStorage.getItem('location_book') || 0);

    const toc = useRef<NavItem[]>([])
    const renditionRef = useRef<Rendition | undefined>(undefined)

    const fontSizePer = useAppSelector(store => store.book.fontSizePer);
    const removeItemHighLightId = useAppSelector(store => store.book.removeItemHighLightId);
    const theme = useAppSelector(store => store.book.theme);

    useEffect(() => {
        let apiUrl = process.env.REACT_APP_BASE_URL || "http://192.168.0.45:3333";
        apiUrl += `/books/${id}`;
        axios.get(apiUrl)
            .then(response => {
                const data = response.data.data;
                setBookUrl(data.ebookUrl);
            })
            .catch(error => {
                // Handle errors
                console.error('Error:', error);
            });
    }, [id]);

    useEffect(() => {
        if (position && position !== "") {
            try {
                const cfi = atob(position);
                setLocation(cfi);
            } catch(e) {
                console.log(e);
            }
        }
    }, [position])

    useEffect(() => {
        const elementsWithAbsolutePosition = document.querySelectorAll('[style*="position: absolute; inset: 50px 50px 20px;"]');
        elementsWithAbsolutePosition.forEach((element: any) => {
            // Add styles directly to the element
            element.style.left = '4px';
            element.style.right = '4px';
            // Add more styles as needed
        });
    }, []);

    useEffect(() => {
        if (renditionRef.current) {
            updateTheme(renditionRef.current, theme)
        }
    }, [theme])

    useEffect(() => {
        if (rendition) {
            const setRenderSelection = (cfiRange: string, contents: Contents) => {
                if (rendition) {
                    dispatch(bookSliceActions.addHighLightTextList({
                        text: rendition.getRange(cfiRange).toString(),
                        cfiRange,
                    }))
                    rendition.annotations.add(
                        'highlight',
                        cfiRange,
                        {},
                        undefined,
                        'hl',
                        { fill: 'red', 'fill-opacity': '0.5', 'mix-blend-mode': 'multiply' }
                    )
                    const selection = contents.window.getSelection()
                    selection?.removeAllRanges()
                }
            }
            rendition.on('selected', setRenderSelection)
            return () => {
                rendition?.off('selected', setRenderSelection)
            }
        }
    }, [dispatch, rendition])

    useEffect(() => {
        renditionRef.current?.themes.fontSize(`${fontSizePer}%`);
    }, [fontSizePer])

    useEffect(() => {
        const tmpFontSize = getLocalStorage('font_size', 100);
        dispatch(bookSliceActions.setFontSize(tmpFontSize));
    }, [dispatch])

    useEffect(() => {
        if (!removeItemHighLightId) return;
        rendition?.annotations.remove(removeItemHighLightId, 'highlight')
        dispatch(bookSliceActions.setRemoveItemHighLightId(null));
    }, [dispatch, removeItemHighLightId, rendition?.annotations])

    const onSaveBookMark = () => {
        let apiUrl = process.env.REACT_APP_BASE_URL || "http://192.168.0.45:3333";
        apiUrl += `/book-mark`;
        const payload = {
            name: page,
            description: '',
            position: String(location),
            userId: Number(userId),
            bookId: Number(id),
        }
        axios.post(apiUrl, payload)
            .then(response => {
                toast.success('Save new book mark successfully', {
                    position: "bottom-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    closeButton: false,
                });
            })
            .catch(error => {
                // Handle errors
                console.error('Error:', error);
            });
    }

    return (
        <>
            <div style={{ height: '100vh', overflow: 'hidden' }}>
                <div
                    className='d-flex py-1 justify-content-center align-items-center'
                    style={{
                        'color': '#7D7E84',
                        'height': '32',
                        'backgroundColor': '#f2f2f2'
                    }}
                >
                    <div
                        className='d-flex align-items-center justify-content-center h-100 w-100'
                        style={{
                            'fontSize': '12px',
                            'whiteSpace': 'nowrap', /* Prevents text from wrapping */
                            'overflow': 'hidden', /* Hides the content that overflows its container */
                            'textOverflow': 'ellipsis', /* Displays an ellipsis (...) to indicate overflow */
                        }}>{page}</div>
                </div>
                <SettingsBook
                    onSaveBookMark={onSaveBookMark}
                />
                <ReactReader
                    url={bookUrl}
                    readerStyles={theme === 'dark' ? darkReaderTheme : lightReaderTheme}
                    location={location}
                    locationChanged={(loc: string) => {
                        setLocation(loc)
                        window.localStorage.setItem('location_book', loc);
                        if (renditionRef.current && toc.current) {
                            const { displayed, href } = renditionRef.current.location.start
                            const chapter = toc.current.find((item) => item.href === href)
                            setPage(`Page ${displayed.page} of ${displayed.total} ${chapter ? 'in chapter ' + chapter.label : ''}`)
                        }
                    }}
                    tocChanged={(_toc: NavItem[]) => {
                        toc.current = _toc
                    }}
                    getRendition={(_rendition: Rendition) => {
                        renditionRef.current = _rendition
                        setRendition(_rendition);
                        _rendition.hooks.content.register((contents: Contents) => {
                            const body = contents.window.document.querySelector('body')
                            if (body) {
                                body.oncontextmenu = () => {
                                    return false
                                }
                            }
                        })
                        renditionRef.current?.themes.fontSize(`${fontSizePer}%`);
                    }}

                    epubOptions={getLocalStorage('is_scroll', false) ? { flow: 'scrolled', manager: 'continuous' } : {}}
                />


            </div >
        </>
    )
}

const lightReaderTheme: IReactReaderStyle = {
    ...ReactReaderStyle,
    readerArea: {
        ...ReactReaderStyle.readerArea,
        transition: undefined,
    },
}

const darkReaderTheme: IReactReaderStyle = {
    ...ReactReaderStyle,
    arrow: {
        ...ReactReaderStyle.arrow,
        color: '#F5F5F5',
    },
    arrowHover: {
        ...ReactReaderStyle.arrowHover,
        color: '#ccc',
    },
    readerArea: {
        ...ReactReaderStyle.readerArea,
        backgroundColor: '#333333',
        transition: undefined,
    },
    titleArea: {
        ...ReactReaderStyle.titleArea,
        color: '#ccc',
    },
    tocArea: {
        ...ReactReaderStyle.tocArea,
        background: '#111',
    },
    tocButtonExpanded: {
        ...ReactReaderStyle.tocButtonExpanded,
        background: '#222',
    },
    tocButtonBar: {
        ...ReactReaderStyle.tocButtonBar,
        background: '#F5F5F5',
    },
    tocButton: {
        ...ReactReaderStyle.tocButton,
        color: 'white',
    },
}

export default Book