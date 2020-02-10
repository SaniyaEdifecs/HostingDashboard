import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import TableComponent from './TableComponent';
// import styles from '../components/HostingDashboard.module.scss';

const HostingDashboard = (props) => {
  return (
    <div  >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <h1>Hosting Dashboard</h1>
        </Grid>
        <Grid item xs={12}>
          <TableComponent  props ={props.context}/>
        </Grid>
      </Grid>
    </div>
  );

};

export default HostingDashboard;