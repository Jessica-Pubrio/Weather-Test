import { useState, useCallback, useEffect, useRef } from 'react';
import { Input } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Icon } from 'umi';
import styles from './search.less';
import _ from 'lodash';


const Search = ({getWeatherInfo, styleVariables, searchLoading}) => {

//search weather
    const [cityName, setCityName] = useState('');
    const debouncedSearch = useRef(_.debounce(getWeatherInfo, 500));

    useEffect(() => {
        console.log('search');
        getWeatherInfo('Singapore');
    }, []);

    useEffect(() => {
        debouncedSearch.current = _.debounce(getWeatherInfo, 500);
    }, [getWeatherInfo]);

    const searchWeather = useCallback(async () => {
        await debouncedSearch.current(cityName);
    }, [cityName, debouncedSearch]);

    return (
        <div className={`${styles.search} ${styleVariables === 'container-night' ? styles.searchNight : ''}`}>
            <Input prefix={'City'} 
                value={cityName} 
                onChange={(event)=>{setCityName(event.target.value)}} />

            <div className={styles.searchBtn} 
            onClick={searchWeather} >
                {
                    searchLoading ? <LoadingOutlined style={{color:'#fff'}} /> : <Icon icon="local:searchIcon" />
                }
            </div>
        </div>
    )
}

export default Search;