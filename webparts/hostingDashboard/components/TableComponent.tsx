import * as  React from 'react';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Link, Grid } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import { FirstPage, LastPage, KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import './CommonStylesheet.scss';
import { MessageBar } from 'office-ui-fabric-react';
import DialogBox from './DialogBox';
import { sp } from '@pnp/sp/presets/all';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

const useStyles1 = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexShrink: 0,
      marginLeft: theme.spacing(2.5),
    },
  }),
);

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onChangePage: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

const TablePaginationActions = (props: TablePaginationActionsProps) => {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (<div className={classes.root}>
    <IconButton
      onClick={handleFirstPageButtonClick}
      disabled={page === 0}
      aria-label="first page"
    >
      {theme.direction === 'rtl' ? <LastPage /> : <FirstPage />}
    </IconButton>
    <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
      {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
    </IconButton>
    <IconButton
      onClick={handleNextButtonClick}
      disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      aria-label="next page"
    >
      {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
    </IconButton>
    <IconButton
      onClick={handleLastPageButtonClick}
      disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      aria-label="last page"
    >
      {theme.direction === 'rtl' ? <FirstPage /> : <LastPage />}
    </IconButton>
  </div>
  );
};



const TableComponent = ({ props }) => {
  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(0);
  const [disableRefresh, setDisableRefresh] = useState(false);
  const [dialogData, setDialogData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const priority = { 1: "Critical", 2: "Urgent", 3: "High", 4: "Medium", 5: "Low", 6: "Project" };
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };


  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getListData = () => {
    sp.web.lists.getByTitle('Footprints-PSSupport').items.filter("substringof('PSHST Build', mrTITLE)").get().then((response: any) => {
      if (response) {
        setDisableRefresh(false);
        setListData(response);
      }
    }, (err) => {
      console.log("error", err.message.value);
    });
  };

  const autoReload = (e) => {
    e.preventDefault();
    setDisableRefresh(true);
    getListData();
  };
  const formatDate = (string) => {
    const DATE_OPTIONS = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return (new Date(string)).toLocaleDateString('en-US', DATE_OPTIONS);
  };

  useEffect(() => { getListData(); }, []);

  const openDialogBox = (item) => {
    // e.preventDefault();
    setDialogData(item);
    setOpenDialog(true);
  };
  const handleChildClick = (value: boolean) => {
    setOpenDialog(value);
  }
  useEffect(() => {
  }, [openDialog]);

  const columns: any[] = ["ESD#", "Priority", "Requestor", "Customer", "Env", "Title", "Description", "ITIO#", "Reason", "Status", "Delivey Date", "Go Live Date"];
  return (
    <Grid container >
      <Grid item xs={12} >
        <div className={disableRefresh ? 'disabledLink' : ""}>
          <Link href="#" className="autoRefresh" type="button" onClick={autoReload}>
            <i className="ms-Icon ms-Icon--Refresh" aria-hidden="true"></i>&nbsp; Refresh
          </Link >
        </div>
      </Grid>
      <Grid item xs={12}>
        <MessageBar className="margin16">
          {"Last Updated at: " + `${new Date().toLocaleString()}`}
        </MessageBar>
        <DialogBox props={openDialog} content={dialogData} onChildClick={handleChildClick} />
      </Grid>
      <Grid item xs={12} className="margin16">
        <TableContainer component={Paper}>
          <Table aria-label="custom pagination table" >
            <TableHead>
              <TableRow>
                {columns.map(column => (
                  <TableCell >
                    {column}
                  </TableCell>
                ))}
              </TableRow>

            </TableHead>
            {listData.length > 0 ? <TableBody>

              {(rowsPerPage > 0
                ? listData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : listData
              ).map((listitem, index) => (
                <TableRow key={index}>
                  {/* <a href={"http://esd/MRcgi/MRlogin.pl?DIRECTLOGIN=1&DOWHAT=JUMPTOTICKET&MR=" + listitem.mrID + "&PROJECTID=25"} target="_blank"></a> */}
                  <TableCell align="left"> {listitem.mrID} </TableCell>
                  <TableCell align="left">
                    <i className={"ms-Icon ms-Icon--FullCircleMask " + (priority[listitem.mrPRIORITY] === "Critical" || priority[listitem.mrPRIORITY] === "Urgent" ? 'red' : priority[listitem.mrPRIORITY] === "High" || priority[listitem.mrPRIORITY] === "Medium" ? 'amber' : '')} aria-hidden="true"></i>
                    &nbsp;{priority[listitem.mrPRIORITY]}
                  </TableCell>
                  <TableCell align="left">{listitem.Requester__bName}</TableCell>
                  <TableCell align="left">{listitem.Customer__bName}</TableCell>
                  <TableCell align="left">{listitem.Environment}</TableCell>
                  <TableCell align="left">{ReactHtmlParser(listitem.mrTITLE)}</TableCell>
                  <TableCell ><a className="descLink" onClick={() => openDialogBox(listitem)}>View <br /> Description</a></TableCell>
                  <TableCell align="left">{listitem.Related__bITIO__b__3}</TableCell>
                  <TableCell align="left">{listitem.Reason ? listitem.Reason.split('__b').join(' ') : ""}</TableCell>
                  <TableCell align="left">{listitem.mrSTATUS ? listitem.mrSTATUS.split('__b').join(' ') : ""}</TableCell>
                  <TableCell align="left">{listitem.Target__bDelivery__bDate ? formatDate(listitem.Target__bDelivery__bDate) : ""}</TableCell>
                  <TableCell align="left">{listitem.Go__bLive__bDate ? formatDate(listitem.Go__bLive__bDate) : ""} </TableCell>
                </TableRow>
              ))}

            </TableBody> : <TableBody> <TableRow>
              <TableCell colSpan={11} >
                <div className="msSpinner">
                  <Spinner label="Fetching data, wait..." size={SpinnerSize.large} />
                </div>
              </TableCell>
            </TableRow>
              </TableBody>
            }

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={11}
                  count={listData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { 'aria-label': 'rows per page' },
                    native: true,
                  }}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Grid>
    </Grid >
  );
};
export default TableComponent;