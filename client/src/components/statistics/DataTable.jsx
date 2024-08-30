import { Table, Progress, Button } from "rsuite";
import { useEffect, useState } from "react";
const { Column, HeaderCell, Cell } = Table;

const DataTable = ({ data, handleOpen }) => {
  // Create a mapping from UUIDs to sequential numbers
  const [uuidToNumberMap, setUuidToNumberMap] = useState({});

  useEffect(() => {
    // Generate a sequential number for each UUID in the data
    const uuidToNumber = {};
    data.forEach((item, index) => {
      uuidToNumber[item.id] = index + 1;
    });
    setUuidToNumberMap(uuidToNumber);
  }, [data]);

  return (
    <Table height={500} data={data}>
      <Column width={100} align="center" fixed>
        <HeaderCell>Кол.</HeaderCell>
        <Cell dataKey="id">
          {(rowData) => <span>{uuidToNumberMap[rowData.id]}</span>}
        </Cell>
      </Column>

      <Column width={800}>
        <HeaderCell>Работа в процессе</HeaderCell>
        <Cell style={{ padding: "10px 0" }}>
          {(rowData) => (
            <Progress
              percent={rowData.progress}
              showInfo={true}
              strokeColor={rowData.progress === 100 ? "#00cc00" : ""}
            />
          )}
        </Cell>
      </Column>
      <Column width={100}>
        <HeaderCell>...</HeaderCell>
        <Cell style={{ padding: "5px 0" }}>
          {(rowData) => (
            <Button appearance="primary" onClick={() => handleOpen(rowData.id)}>
              Отмена
            </Button>
          )}
        </Cell>
      </Column>
    </Table>
  );
};

export { DataTable };
