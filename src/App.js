import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {useDispatch, useSelector} from "react-redux";
import MaterialTable from "material-table";
import {Box, Button, Grid} from '@mui/material';
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';

const App = () => {
    const dispatch = useDispatch();

    const workTime = useSelector((state) => state.defaultReducer.workTime).sort((a,b) => {
        return moment(a.startDate) > moment(b.startDate);
    });

    const [dataArray, setDataArray] = useState([]);
    const [chartType, setChartType] = useState('DD.MM.YYYY');

    useEffect(() => {
      const workTimeGrouped = workTime.reduce( ( acc, item ) => {
          let key = moment(item.startDate).format(chartType);
          ( acc[ key ] ) ? acc[ key ].push( item.difference ): ( acc[ key ] = [ item.difference ] );
          return acc;
      }, {} );
      let workHoursByDay = [];
      /* eslint-disable-next-line array-callback-return */
      Object.keys(workTimeGrouped).map((key) => {
          let workHoursSum = 0;
          workTimeGrouped[key].forEach((element) => {
              workHoursSum = workHoursSum + Math.floor((element / (1000 * 60 * 60)) % 24) + Math.floor((element / (1000 * 60)) % 60) / 60;
          });
          workHoursByDay.push({
            name: key,
            hours: workHoursSum.toFixed(2),
          });
          setDataArray(workHoursByDay);
      });
      }, [workTime, chartType]
  );

    const guidGenerator = () => {
      const S4 = function () {
          return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      };
      return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }

  const handleSwitchChart = () => {
    chartType === 'DD.MM.YYYY' ? setChartType('MMMM') : setChartType('DD.MM.YYYY');
  }

  const calculateDifference = (startTime, endTime) => {
    endTime.set({
      day:   startTime.get('day'),
      month: startTime.get('month'),
      year: startTime.get('year')
    });
    const differenceMinutes = moment.duration(endTime.diff(startTime))._data.minutes;
    const differenceHours = moment.duration(endTime.diff(startTime))._data.hours;
    if ((!differenceMinutes && ! differenceHours) || (differenceHours < 0 || differenceMinutes < 0)) {
        return false;
    } else {
        return (moment.duration(endTime.diff(startTime))._milliseconds);
    }
  }
  
  return(
    <>
        <div style={{ maxWidth: '100%' }}>
            <MaterialTable
                title="Timing Table"
                data={workTime}
                columns={[
                    { title: 'Date', field: 'startDate', type: 'date', render: rowData =>
                            (<>
                                {moment(rowData.startDate).format("DD.MM.YYYY")}
                            </>),
                    },
                    { title: 'Start', field: 'startDate', type: 'time',  render: rowData =>
                            (<>
                                {moment(rowData.startDate).format("HH.mm")}
                            </>),
                    },
                    { title: 'End', field: 'endDate', type: 'time', render: rowData =>
                            (<>
                                {moment(rowData.endDate).format("HH.mm")}
                            </>),
                    },
                    { title: 'Duration', field: 'difference', editable: false, render: rowData =>
                            (<>
                                {moment.utc(rowData.difference).format('HH:mm')}
                            </>),
                    },
                ]}
                editable={{
                    onRowAdd: newData => 
                    new Promise((resolve, reject) => {
                            const difference = calculateDifference(moment(newData.startDate), moment(newData.endDate));
                            console.log(difference);
                            if (difference) {
                                dispatch({
                                    type: 'ADD_WORK_TIME',
                                    payload: {
                                        id: guidGenerator(),
                                        ...newData,
                                        difference,
                                    }
                                });
                                resolve();
                            } else {
                              reject();
                            }
                          }),
                    onRowUpdate: (newData) =>
                        new Promise((resolve, reject) => {
                            const difference = calculateDifference(moment(newData.startDate), moment(newData.endDate));
                            if (difference) {
                                dispatch({
                                    type: 'UPDATE_WORK_TIME',
                                    payload: {
                                        ...newData,
                                        difference,
                                    },
                                });
                                resolve();
                            } else {
                              reject();
                            }
                        }),
                    onRowDelete: oldData =>
                        new Promise((resolve, reject) => {
                            dispatch({
                                type: 'DELETE_WORK_TIME',
                                payload: oldData.id,
                            });
                            resolve();
                        }),
                }}
            />
        </div>
        <>
            <Grid container justifyContent="center">
            <ResponsiveContainer 
              width="100%" 
              height={600} 
              data={dataArray}
              key={`rc_${dataArray.length}`}>
              <LineChart
                  data={dataArray}
                  margin={{
                    top: 50,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="hours" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
              
            </Grid>
            <Grid container justifyContent="center">
                <Box m={5}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSwitchChart}
                    >
                        {chartType === 'MMMM' ? 'daily' : 'monthly'} chart
                    </Button>
                </Box>
            </Grid>
        </>
    </>
  )
}

export default App;
