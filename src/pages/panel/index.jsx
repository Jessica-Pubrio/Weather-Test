import { useEffect,useState } from 'react';
import styles from './index.less';
import HistoryItem from './historyItem';
import { useMemo } from 'react';
import { format } from 'date-fns'
import { message } from 'antd';
import { useCallback } from 'react';

const Panel = ({ styleVariables, weatherInfo, getWeatherInfo, loadingId }) => {

    const [time, setTime] = useState(null);
    const[historyList, setHistory] = useState([])

//get weatherHistory
    useEffect(() => {
        if(weatherInfo){
            const formattedTime = getCurrentFormattedDate();
            setTime(formattedTime);
            const info = {...weatherInfo, time: time, id: Date.now()};
            if(time === null) return;
            setHistory([...historyList, info])
        }
    }, [weatherInfo]);

//get current time
    const getCurrentFormattedDate = () => {
        const now = new Date();
        return format(now, "dd-MM-yyyy hh:mm aaaa");
    }

//delete historyItem
    const deleteHistoryItem = useCallback((id) => {
        const newInfos = historyList.filter(info => info.id !== id);
        setHistory(newInfos);
        message.success('Delete success');
    },[historyList]);

//trans temperature
    const kelvinToCelsius = (kelvin, fixed = 2) => {
        return (kelvin - 273.15).toFixed(fixed); // 保留两位小数
    }
    const { mainTemp, HT, LT } = useMemo(() => {
        return {
            mainTemp: kelvinToCelsius(weatherInfo?.main.temp, 1),
            HT: kelvinToCelsius(weatherInfo?.main.temp_max),
            LT: kelvinToCelsius(weatherInfo?.main.temp_min)
        };
    }, [weatherInfo]);

    return (
        <div className={`${styles.panelContainer} ${styleVariables === 'container-night' ? styles.panelContainerNight : ''}`}>
            <div className={styles.weatherImage}>
                {  weatherInfo?.weather[0].main === 'Rain' ? 
                    <img src={require('@/assets/cloud.png')} alt="weather" /> :
                    <img src={require('@/assets/sun.png')} alt="weather" />
                }
            </div>
            <div className={styles.screen}>
                <div className={styles.text}>Today’s Weather</div>
                <div className={styles.temperature}>{ weatherInfo ? (`${mainTemp}°`) : '--' }</div>
                <div className={styles.temperatureRange}>{ weatherInfo ? (`H: ${HT}° L: ${LT}°`) : '' }</div>
                <div className={styles.screenBottom}>
                    <div className={styles.location}>
                        <b>{weatherInfo ? `${weatherInfo.name}, ${weatherInfo.sys.country}` : ''}</b>
                    </div>
                    <div className={styles.temperatureInfos}>
                        <div className={styles.time}>{ weatherInfo ? time : '' }</div>
                        <div className={styles.humidity}>
                            {weatherInfo ?  `Humidity: ${weatherInfo.main.humidity}%` : ''}
                        </div>
                        <div className={styles.weather}>
                            {weatherInfo && weatherInfo.weather.length > 0 ? weatherInfo.weather[0].main : ''}
                        </div>
                    </div>
                </div>

            </div>
            <div className={styles.history}>
                <div className={styles.title}>Search History</div>
                {
                    historyList.length > 0? 
                    <ul className={styles.content}>
                        { historyList.map((history, index) =>{
                            return <HistoryItem history={history}
                                                getWeatherInfo={getWeatherInfo} 
                                                deleteHistoryItem={deleteHistoryItem}
                                                loadingId={loadingId}
                                                styleVariables={styleVariables} 
                                                key={history.id} />
                            })
                        }
                    </ul> : <div className={styles.noRecords}>No History Records</div>
                }
            </div>
        </div>
    );
};

export default Panel;