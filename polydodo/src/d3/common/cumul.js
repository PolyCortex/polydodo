//Calculate the stage portion position on X 
export const calculateCumulation = (data, i) =>{
    if(i === 0)
      return 0;
    else{
      var cumul = data[0];
      if(i != 4)
        cumul += data[4]; 
      if(i === 2 || i === 3 )
        cumul += data[1]; 
      if(i === 3)
        cumul += data[2]; 
    }
    return cumul;
  }
  
  export const calculateCumulationAllTimeStamp = (totalStagePortion,firstIndexes,d,i) => {
    if(i === firstIndexes[0])
      return 0;
    if(i === firstIndexes[d.stage]){
      var cumul = totalStagePortion[0];
      if(d.stage != 4)
        cumul += totalStagePortion[4]; 
      if(d.stage === 2 || d.stage === 3 )
        cumul += totalStagePortion[1]; 
      if(d.stage === 3)
        cumul += totalStagePortion[2];
      return cumul;
    }
    else
      return 0;
  }
  