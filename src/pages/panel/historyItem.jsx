import styles from './index.less';
import { Icon } from 'umi'; 
import { Button } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useCallback } from 'react';

const HistoryItem = ({ history, styleVariables, getWeatherInfo, deleteHistoryItem, loadingId }) => {

    const handleSearch = useCallback((cityName,id) => {
        getWeatherInfo(cityName,id);
    }, [getWeatherInfo]);
    
    const handleDelete = useCallback((id) => {
        deleteHistoryItem(id);
    }, [deleteHistoryItem]);

    return ( 
        <li className={styles.historyItem}  key={history.id} >
            <div className={styles.left}>
                <span className={styles.city}>{history?.name} {history?.sys.country}</span>
                <span className={styles.time}>{history.time}</span>
            </div>
            <div className={styles.right}>
                <Button className={styles.action} onClick={ () => handleSearch(history?.name,history.id) }>
                    {   
                          loadingId===history.id ? (
                            styleVariables === 'container-night' ? 
                                <LoadingOutlined style={{ color: '#fff' }} /> : 
                                <LoadingOutlined />
                        ) : ( 
                            styleVariables === 'container-night' ? 
                                <Icon icon="local:search-night" /> : 
                                <Icon icon="local:search" />
                        )
                       
                    }
                </Button>
                <Button className={styles.action} onClick={ () => handleDelete(history?.id) } >
                    { 
                            styleVariables === 'container-night' ? <Icon icon="local:trash-night" /> :<Icon icon="local:trash" />
                    }
                </Button>
            </div>
            
        </li>
        )
}

export default HistoryItem; 