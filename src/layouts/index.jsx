import global from '@/global.less';
import styles from './index.less';
import { useState, useEffect, useCallback } from 'react';
import { message, Switch } from 'antd';
import Panel from '@/pages/panel/index';
import Search from '@/pages/search/search';
import axios from 'axios';


export default function Layout() {
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  
//toggle styles based on time
  const [styleVariables, setStyleVariables] = useState('');
  useEffect(() => {
    const toggleStyle = () => {
      const hour = new Date().getHours();
      const isDaytime = hour > 6 && hour < 18;
      const newStyle = isDaytime ? '' : 'container-night';
      setStyleVariables(newStyle);
    };
    toggleStyle(); 
    const intervalId = setInterval(toggleStyle, 60000);  // 每分钟检查一次
    return () => clearInterval(intervalId); 
  }, []);

  const onChange = (checked) => {
    console.log(`switch to ${checked}`);
    setStyleVariables(checked ? 'container-night' : '');
  };

//search weather
  const getWeatherInfo = useCallback((cityName,id) =>{
      setSearchLoading(true);
      setLoadingId(id);
    const params = {q: cityName,appid: '69697dc691cd22eb0a67d15123b11c91' };
      axios.get("https://api.openweathermap.org/data/2.5/weather", { params })
        .then(response => {
            const data = response.data;
            setWeatherInfo(data);
        }).catch(error => {
            console.error('Error:', error)
            message.warning('No data found. Please make sure you enter the correct city name');
        }).finally(() => {
            setSearchLoading(false);
            setLoadingId(null);
        });
    }, []);


  return (
    <div className={`${styles.container} ${styles[styleVariables]}`}>
      <Switch value={styleVariables} onChange={onChange} />
      <Search getWeatherInfo={getWeatherInfo} styleVariables={styleVariables} searchLoading={searchLoading} />
      <Panel styleVariables={styleVariables} 
             getWeatherInfo={getWeatherInfo} 
             weatherInfo={weatherInfo} 
             loadingId={loadingId}
            />
     
    </div>
  );
}
