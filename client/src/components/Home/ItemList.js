import React, { useEffect } from "react";
import styled from "styled-components/macro";
import Item from "./Item";
import { useSelector, useDispatch } from "react-redux";
import { getNextPage } from "../../Actions";
import { listToMatrix } from "../../Helper/matrixConverter";

const ItemList = () => {
  const itemsList = useSelector((state) => state.itemList.items);
  const category = useSelector((state) => state.itemList.category);
  const showViewMore = useSelector((state) => state.itemList.showViewMore);
  const dispatch = useDispatch();


  const fetchItems = async (category) => {
    const numOfItemsToSkip = itemsList.flat().length;
    const data = await fetch("http://localhost:4000/api/items/" + category + "?skip=" + numOfItemsToSkip);

    if (data.ok) {
      const items = await data.json();
      const matrix = listToMatrix(items);
      const newSet = itemsList.concat(matrix);
      dispatch(getNextPage(newSet, category));
    }
  };

  return (
    <Wrapper>
      <ListWrapper>
        {itemsList &&
          (itemsList.map((items, index) => {
            return (<Row key={index}>
              {items.map(item => <Item key={item._id} item={item} />)}
            </Row>)
          }))}
      </ListWrapper>
      {showViewMore && <ListFooter>
        <ViewMore onClick={() => {fetchItems(category)}}>View more...</ViewMore>
      </ListFooter>}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 30px;
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const ListFooter = styled.div`
  width: 100%;
  text-align: right;
  padding-right: 30px;
`;

const ViewMore = styled.a`
  cursor: pointer;

  &:hover {
    color: blue;
  }
`

export default ItemList;
