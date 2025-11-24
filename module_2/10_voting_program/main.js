"use strict";

function promptNumber(promptMsg) {
  let rawInput;
  let result;
  do {
    rawInput = prompt(promptMsg);
    if (rawInput === "") continue;
    if (rawInput === null) continue;
    result = Number(rawInput);
  } while (!Number.isInteger(result));
  return result;
}

function promptName(promptMsg, acceptEmpty = false) {
  let rawInput;
  while (true) {
    rawInput = prompt(promptMsg);

    if (rawInput === "") {
      if (acceptEmpty) return rawInput;
      continue;
    }
    if (rawInput == null) continue;
    return rawInput;
  }
}

function vote(candidates) {
  while (true) {
    const options = candidates
      .map((c, idx) => `${idx + 1}. ${c.name}`)
      .join("\n");
    const candidateName = promptName(
      "Candidates:\n" + options + "\n\nVote by entering candidate's name:",
      true,
    );
    if (candidateName === "") return null;
    if (
      candidates.find(
        (c) => c.name.toLowerCase() === candidateName.toLocaleLowerCase(),
      )
    )
      return candidateName;
    alert("");
  }
}

function* prompter() {
  // 1. num of candidates
  const candidateCount = promptNumber("Enter the number of candidates");
  yield candidateCount;

  // 2. candidate names
  const candidateObjArray = [];
  for (let i = 0; i < candidateCount; i++) {
    const candidateName = promptName(`Name for candidate ${i + 1}`);
    candidateObjArray.push({ name: candidateName, votes: 0 });
    yield candidateName;
  }

  // 3. num of voters
  const voterCount = promptNumber("Enter the number of voters");
  yield voterCount;

  // 4. Vote
  for (let i = 0; i < voterCount; i++) {
    const votedCandidate = vote(candidateObjArray);
    const candidate = candidateObjArray.find((c) => c.name === votedCandidate);
    if (candidate) {
      candidate.votes++;
      yield Object(`${candidate.name} ${candidate.votes}`);
    }
  }

  // 5. Print results
  const resultArray = [...candidateObjArray].sort((a, b) => b.votes - a.votes);
  const winner = resultArray[0];
  console.log(`The winner is: ${winner.name} with ${winner.votes} votes.`);
  yield resultArray.reduce((prev, curr, idx) => {
    return prev + `${idx + 1}. ${curr.name} - ${curr.votes} votes\n`;
  }, "\n");
}

const promptGen = prompter();
let result;
while (!(result = promptGen.next()).done) {
  console.log(`Result:${result.value}`);
}
