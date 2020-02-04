import * as React from 'react';
import styles from './HostingDashboard.module.scss';
import { IHostingDashboardProps } from './IHostingDashboardProps';
import Grid from '@material-ui/core/Grid';
import TableComponent from './TableComponent';

const HostingDashboard = (props) => {
  return (
    <div className={styles.hostingDashboard} >
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