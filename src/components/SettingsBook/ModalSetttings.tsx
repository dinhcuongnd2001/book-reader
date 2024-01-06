import React, { useEffect, useState } from 'react'
import { Slider, Switch } from 'antd';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { bookSliceActions } from '../../store/Book/bookSlice';
import { produce } from "immer";

const MAX_LENGTH_TEXT = 150;

const ModalSetttings = () => {
    const dispatch = useAppDispatch();

    const [fontSizePer, setFontSizePer] = useLocalStorage('font_size', 100);
    const [isScroll, setIsScroll] = useLocalStorage('is_scroll', false);

    const [isShowFullText, setIsShowFullText] = useState<boolean[]>([]);

    const highlightTextList = useAppSelector(store => store.book.highlightTextList);
    const theme = useAppSelector(store => store.book.theme);

    useEffect(() => {
        const tmpList: boolean[] = [];
        highlightTextList.forEach(() => {
            tmpList.push(true);
        });
        setIsShowFullText(tmpList);
    }, [highlightTextList])

    const onChangeSlider = (value: any) => {
        dispatch(bookSliceActions.setFontSize(value));
        setFontSizePer(value);
    };

    const onChangeScroll = (checked: boolean) => {
        setIsScroll(checked);
        dispatch(bookSliceActions.setIsScroll(checked));
        setTimeout(() => {
            window.location.reload();
        }, 250);
    }

    const onChangeTheme = (checked: boolean) => {
        dispatch(bookSliceActions.setTheme(checked ? 'dark' : 'light'));
    };

    const onChangeShowMoreHightLight = (index: number) => {
        setIsShowFullText(produce((draft) => {
            const checked = draft[index];
            draft[index] = !checked;
        }))
    };
    
    const onRemoveItemHighLight = (index: number, cfiRange: string) => {
        dispatch(bookSliceActions.removeItemHighLight(index));
        dispatch(bookSliceActions.setRemoveItemHighLightId(cfiRange));
    };

    const truncateText = (text: string) => {
        if (text.length <= MAX_LENGTH_TEXT) {
            return text;
        } else {
            return `${text.slice(0, MAX_LENGTH_TEXT)}...`;
        }
    };

    return (
        <div className='p-3 position-relative overflow-auto'>
            <div className='mb-3'>
                <label className='fw-semibold'>Phông chữ: {fontSizePer}%</label>
                <Slider
                    defaultValue={fontSizePer}
                    min={50}
                    max={200}
                    step={10}
                    onChangeComplete={onChangeSlider}
                />
            </div>
            <div className='mb-3 d-flex align-items-center'>
                <label className='fw-semibold me-3'>Dạng cuộn</label>
                <Switch value={isScroll} onChange={onChangeScroll} />
            </div>
            <div className='mb-3 d-flex align-items-center'>
                <label className='fw-semibold me-3'>Nền tối</label>
                <Switch value={theme === 'dark'} onChange={onChangeTheme} />
            </div>
            <div
                className='mb-3 d-flex flex-column'
            >
                <label className='fw-semibold me-3'>Danh sách highlight: {highlightTextList.length}</label>
                <div className='d-flex flex-column'>
                    {highlightTextList.map((highlightItem, index) => {
                        return (
                            <div key={index} className='mb-2'>
                                <span>{isShowFullText[index] ? truncateText(highlightItem.text) : highlightItem.text}</span>
                                {
                                    highlightItem.text.length > MAX_LENGTH_TEXT &&
                                    <span
                                        className='ms-2'
                                        style={{ 'color': '#424BAF' }}
                                        onClick={() => onChangeShowMoreHightLight(index)}
                                    >
                                        {isShowFullText[index] ? 'Xem thêm' : 'Thu gọn'}
                                    </span>
                                }
                                <i 
                                    className="fa fa-trash ms-3 text-danger fs-4" aria-hidden="true"
                                    onClick={() => onRemoveItemHighLight(index, highlightItem.cfiRange)}
                                ></i>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default ModalSetttings