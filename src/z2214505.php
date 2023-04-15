<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET,HEAD,OPTIONS,POST,PUT');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

require('./dbconnect.php');
class data {};
$data = new data();

$userId = "";
$password = "";
$wordId = "";

if (isset($_GET['userId'])) {
    $userId = $_GET['userId'];
}
if (isset($_GET['password'])) {
    $password = $_GET['password'];
}
if (isset($_GET['wordId'])) {
    $wordId = $_GET['wordId'];
}

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    if ($_GET['step'] == "controlImportant") {
        $newImportant = $_GET['newImportant'];
        $sql = "UPDATE words SET important = '$newImportant' WHERE userId = '$userId' and wordId = '$wordId'";
        $dbh->query($sql);
    }
    if ($_GET['step'] == "controlCommentDelete") {
        $commentId = $_GET['commentId'];
        $sql = "DELETE FROM comment WHERE userId = '$userId' and wordId = '$wordId' and commentId = '$commentId'";
        $dbh->query($sql);
    }
    if ($_GET['step'] == "controlExampleDelete") {
        $exampleId = $_GET['exampleId'];
        $sql = "DELETE FROM example WHERE userId = '$userId' and wordId = '$wordId' and exampleId = '$exampleId'";
        $dbh->query($sql);
    }
    if ($_GET['step'] == "1") {
        $sql = "SELECT * FROM user where userId = '$userId' and password = '$password'";
        $stmt = $dbh->query($sql);
        foreach ($stmt as $row) {
            $data->{'userId'} = $row['userId'];
            $data->{'password'} = $row['password'];
            $data->{'score'} = $row['score'];
        }

        if (isset($data->userId)) {
            $sql = "SELECT * FROM words where userId = '$data->userId'";
            $stmt = $dbh->query($sql);
            $words = [];
            foreach ($stmt as $row) {
                $word = new data();
                $word->{'wordId'} = $row['wordId'];
                $word->{'word'} = $row['word'];
                $word->{'mean'} = $row['mean'];
                $word->{'important'} = $row['important'];
                $words[] = $word; 
            }
            $data->{'words'} = $words;

            $sql = "SELECT * FROM comment where userId = '$data->userId'";
            $stmt = $dbh->query($sql);
            $re = [];
            foreach($stmt as $row) {
                $re[] = $row;
            }
            $i = 0;
            foreach ($words as $w) {
                $comments = [];
                foreach ($re as $row) {
                    if ($row['wordId'] == $w->wordId) {
                        $commentData = new data();
                        $commentData->{'commentId'} = $row['commentId'];
                        $commentData->{'content'} = $row['content'];
                        $comments[] = $commentData;
                    }
                }
                $data->words[$i]->{'comments'} = $comments;
                $i = $i+1;
            }

            $sql = "SELECT * FROM example where userId = '$data->userId'";
            $stmt = $dbh->query($sql);
            $re = [];
            foreach($stmt as $row) {
                $re[] = $row;
            }
            $i = 0;
            foreach ($words as $w) {
                $examples = [];
                foreach ($re as $row) {
                    if ($row['wordId'] == $w->wordId) {
                        $exampleData = new data();
                        $exampleData->{'exampleId'} = $row['exampleId'];
                        $exampleData->{'content'} = $row['content'];
                        $examples[] = $exampleData;
                    }
                }
                $data->words[$i]->{'examples'} = $examples;
                $i = $i+1;
            }
        }

        $myJSON = json_encode($data);
        echo $myJSON;
    } 
    if ($_GET['step'] === "kickUser") {
        $sql="
        DELETE FROM user WHERE userId='$userId';
        DELETE FROM words WHERE userId='$userId';
        DELETE FROM comment WHERE userId='$userId';
        DELETE FROM example WHERE userId='$userId'
        ";
        $dbh->query($sql);

        $id = date("Y/m/d_H:i:s");
        $fromtable = "user";
        $content = "Kicked ".$userId." out";
        $sql = "INSERT INTO adminlog (id,fromtable,userId,content) VALUES (:i,:frtable,:userI,:cont)";
        $stmt = $dbh->prepare($sql);
        $params = array(':i'=>$id, ':frtable'=>$fromtable, ':userI'=>$userId,':cont'=>$content);
        $stmt->execute($params);
    }
    function getAll ($table, $dbh) {
        $sql = "SELECT * FROM $table";
        $stmt = $dbh->query($sql);
        $data = [];
        foreach($stmt as $row) {
            $data[] = $row;
        }
        $myJSON = json_encode($data);
        echo $myJSON;
    }
    if ($_GET['step'] === "allWords") {
        getAll("words", $dbh);
    }
    if ($_GET['step'] === "getAllUser") {
        getAll("user", $dbh);
    }
    if ($_GET['step'] === "seeLog") {
        getAll("adminlog", $dbh);
    }
    if ($_GET['step'] === "allQuestions") {
        getAll("question", $dbh);
    }
    if ($_GET['step'] === "allAnswers") {
        $quesIncre = $_GET['quesIncre'];
        $sql = "SELECT * FROM answer WHERE quesIncre='$quesIncre'";
        $stmt = $dbh->query($sql);
        $data = [];
        foreach($stmt as $row) {
            $data[] = $row;
        }
        $myJSON = json_encode($data);
        echo $myJSON;
    }
    if ($_GET['step'] === "like") {
        $incre = $_GET['incre'];
        
        $sql = "SELECT * FROM question WHERE incre='$incre'";
        $stmt = $dbh->query($sql);
        $like = "";
        foreach($stmt as $row) {
            $like = $row['liked'];
        }
        if ($like == "0") {
            $like = $userId.",";
        } else {
            $likers = explode(",",$like);
            $newLikers = [];
            $yes = false;
            foreach ($likers as $liker) {
                if ($liker == $userId) {
                    $yes = true;
                } elseif ($liker != "") {
                    $newLikers[] = $liker; 
                }
            }
            if (!$yes) {
                $newLikers[] = $userId;
            }
            $like = "";
            foreach ($newLikers as $liker) {
                $like = $like.$liker.",";
            }
        }
        if ($like == "") { $like = "0"; }
        $sql = "UPDATE question SET liked = '$like' WHERE incre = '$incre'";
        $dbh->query($sql);
    }
} elseif ($_SERVER["REQUEST_METHOD"] == "POST") {
    if ($_GET['step'] === "controlCommentAdd_Edit") {
        if (isset($_GET['editId'])) {
            $commentId = $_GET['editId'];
            if (isset($_POST['content']) && $_POST['content'] != "") {
                $contentComment = $_POST['content'];
                $sql = "UPDATE comment SET content = '$contentComment' WHERE userId = '$userId' and wordId = '$wordId' and commentId = '$commentId'";
                $dbh->query($sql);
            } else {
                $sql = "DELETE FROM comment WHERE userId = '$userId' and wordId = '$wordId' and commentId = '$commentId'";
                $dbh->query($sql);
            }
        } else {
            $commentId = date('ymdHis');
            if (isset($_POST['content']) && $_POST['content'] != "") {
                $contentComment = $_POST['content'];
                $sql = "INSERT INTO comment (userId,wordId,commentId,content) VALUES (:user,:word,:comm,:cont)";
                $stmt = $dbh->prepare($sql);
                $params = array(':user'=>$userId,':word'=>$wordId,':comm'=>$commentId, ':cont'=>$contentComment);
                $stmt->execute($params);
            }
        }
    } 
    if ($_GET['step'] === "controlExampleAdd_Edit") {
        if (isset($_GET['editId'])) {
            $exampleId = $_GET['editId'];
            if (isset($_POST['content']) && $_POST['content'] != "") {
                $contentExample = $_POST['content'];
                $sql = "UPDATE example SET content = '$contentExample' WHERE userId = '$userId' and wordId = '$wordId' and exampleId = '$exampleId'";
                $dbh->query($sql);
            } else {
                $sql = "DELETE FROM example WHERE userId = '$userId' and wordId = '$wordId' and exampleId = '$exampleId'";
                $dbh->query($sql);
            }
        } else {
            $exampleId = date('ymdHis');
            if (isset($_POST['content']) && $_POST['content'] != "") {
                $contentExample = $_POST['content'];
                $sql = "INSERT INTO example (userId,wordId,exampleId,content) VALUES (:user,:word,:exa,:cont)";
                $stmt = $dbh->prepare($sql);
                $params = array(':user'=>$userId,':word'=>$wordId,'exa'=>$exampleId, ':cont'=>$contentExample);
                $stmt->execute($params);
            }
        }
    } 
    if ($_GET['step'] === "addNewWord") {
        $newId = date('ymdHis');
        $word = $_POST['word'];
        $mean = $_POST['mean'];
        $comment = $_POST['comment'];
        $example = $_POST['example'];

        $sql = "INSERT INTO words (userId,wordId,word,mean,important) VALUES (:userI,:wordI,:wor,:mea,:imp)";
        $stmt = $dbh->prepare($sql);
        $params = array(':userI'=>$userId,':wordI'=>$newId,':wor'=>$word, ':mea'=>$mean, ':imp'=>'0');
        $stmt->execute($params);
        if ($comment != "") {
            $sql = "INSERT INTO comment (userId,wordId,commentId,content) VALUES (:userI,:wordI,:commentI,:cont)";
            $stmt = $dbh->prepare($sql);
            $params = array(':userI'=>$userId,':wordI'=>$newId,':commentI'=>$newId, ':cont'=>$comment);
            $stmt->execute($params);
        }
        if ($example != "") {
            $sql = "INSERT INTO example (userId,wordId,exampleId,content) VALUES (:userI,:wordI,:exampleI,:cont)";
            $stmt = $dbh->prepare($sql);
            $params = array(':userI'=>$userId,':wordI'=>$newId,':exampleI'=>$newId, ':cont'=>$example);
            $stmt->execute($params);
        }
    } 
    if ($_GET['step'] === "addNewWordToEveryOne") {
        $newId = date('ymdHis');
        $word = $_POST['word'];
        $mean = $_POST['mean'];
        $comment = $_POST['comment'];
        $example = $_POST['example'];

        $sql = "SELECT * FROM user";
        $stmt = $dbh->query($sql);
        $allUser = [];
        foreach($stmt as $row) {
            $allUser[] = $row['userId'];
        }
        foreach ($allUser as $user) {
            $sql = "INSERT INTO words (userId,wordId,word,mean,important) VALUES (:userI,:wordI,:wor,:mea,:imp)";
            $stmt = $dbh->prepare($sql);
            $params = array(':userI'=>$user,':wordI'=>$newId,':wor'=>$word, ':mea'=>$mean, ':imp'=>'1');
            $stmt->execute($params);
            if ($comment != "") {
                $sql = "INSERT INTO comment (userId,wordId,commentId,content) VALUES (:userI,:wordI,:commentI,:cont)";
                $stmt = $dbh->prepare($sql);
                $params = array(':userI'=>$user,':wordI'=>$newId,':commentI'=>$newId, ':cont'=>$comment);
                $stmt->execute($params);
            }
            if ($example != "") {
                $sql = "INSERT INTO example (userId,wordId,exampleId,content) VALUES (:userI,:wordI,:exampleI,:cont)";
                $stmt = $dbh->prepare($sql);
                $params = array(':userI'=>$user,':wordI'=>$newId,':exampleI'=>$newId, ':cont'=>$example);
                $stmt->execute($params);
            }
        }

        $id = date("Y/m/d_H:i:s");
        $fromtable = "words";
        $content = $word.": ".$mean;
        if ($comment != "") {$content = $content.". Com: ".$comment;}
        if ($example != "") {$content = $content.". Exa: ".$example;}
        $sql = "INSERT INTO adminlog (id,fromtable,userId,content) VALUES (:i,:frtable,:userI,:cont)";
        $stmt = $dbh->prepare($sql);
        $params = array(':i'=>$id, ':frtable'=>$fromtable, ':userI'=>"everyone",':cont'=>$content);
        $stmt->execute($params);
    }
    if ($_GET['step'] === "editWord") {
        $word = $_POST['word'];
        $mean = $_POST['mean'];

        $sql = "UPDATE words SET word = '$word', mean = '$mean' WHERE userId = '$userId' and wordId = '$wordId'";
        $dbh->query($sql);

        $comExaId = [];
        $sql = "SELECT * FROM comment where userId = '$userId' and wordId = '$wordId'";
        $stmt = $dbh->query($sql);
        $countCom = 0;
        foreach($stmt as $row) {
            $countCom = $countCom + 1;
            $comExaId[] = $row['commentId'];
        }
        $sql = "SELECT * FROM example where userId = '$userId' and wordId = '$wordId'";
        $stmt = $dbh->query($sql);
        $countExa = 0;
        foreach($stmt as $row) {
            $countExa = $countExa + 1;
            $comExaId[] = $row['exampleId'];
        }

        $comExaEdit = [];
        for ($i=0; $i<$countCom+$countExa; $i++) {
            $n = "comExa".strval($i);
            $comExaEdit[] = $_POST[$n];
        }

        for ($i=0; $i<$countCom; $i++) {
            $content = $comExaEdit[$i];
            $commentId = $comExaId[$i];
            $sql = "UPDATE comment SET content = '$content' WHERE userId = '$userId' and wordId = '$wordId' and commentId = '$commentId'";
            $dbh->query($sql);
        }
        for ($i=$countCom; $i<$countCom+$countExa; $i++) {
            $content = $comExaEdit[$i];
            $exampleId = $comExaId[$i];
            $sql = "UPDATE example SET content = '$content' WHERE userId = '$userId' and wordId = '$wordId' and exampleId = '$exampleId'";
            $dbh->query($sql);
        }
    } 
    if ($_GET['step'] === "clearWord") {
        $sql = "
            DELETE FROM words WHERE userId = '$userId' and wordId = '$wordId';
            DELETE FROM comment WHERE userId = '$userId' and wordId = '$wordId';
            DELETE FROM example WHERE userId = '$userId' and wordId = '$wordId'
        ";
        $dbh->query($sql);
    }
    if ($_GET['step'] === "changePassword") {
        $sql = "SELECT * FROM user where userId = '$userId' and password = '$password'";
        $stmt = $dbh->query($sql);
        $yes = false;
        foreach ($stmt as $row) {
            $yes = true;
        }
        if ($yes) {
            $newPassword = $_POST["newPassword"];
            $sql = "UPDATE user SET password = '$newPassword' WHERE userId = '$userId'";
            $dbh->query($sql);
        }
    }
    if ($_GET['step'] === "changeId") {
        $sql = "SELECT * FROM user where userId = '$userId' and password = '$password'";
        $stmt = $dbh->query($sql);
        $yes = false;
        foreach ($stmt as $row) {
            $yes = true;
        }
        if ($yes) {
            $newId = $_POST["newId"];
            $sql = "
                UPDATE user SET userId = '$newId' WHERE userId = '$userId';
                UPDATE words SET userId = '$newId' WHERE userId = '$userId';
                UPDATE comment SET userId = '$newId' WHERE userId = '$userId';
                UPDATE example SET userId = '$newId' WHERE userId = '$userId';
            ";
            $dbh->query($sql);
        }
    }
    if ($_GET['step'] === "newUser") {
        $userId = $_POST['userId'];
        $password = $_POST['password'];

        $sql = "INSERT INTO user (userId,password) VALUES (:userI,:pass)";
        $stmt = $dbh->prepare($sql);
        $params = array(':userI'=>$userId,':pass'=>$password);
        $stmt->execute($params);
        $sql = "INSERT INTO words (userId,wordId,word,mean,important) VALUES (:userI,:wordI,:wor,:mea,:imp)";
        $stmt = $dbh->prepare($sql);
        $params = array(':userI'=>$userId,':wordI'=>date('ymdHis'),':wor'=>'KiisEnglish',':mea'=>'英語勉強アプリ',':imp'=>'0');
        $stmt->execute($params);

        $id = date("Y/m/d_H:i:s");
        $fromtable = "user";
        $content = "init";
        $sql = "INSERT INTO adminlog (id,fromtable,userId,content) VALUES (:i,:frtable,:userI,:cont)";
        $stmt = $dbh->prepare($sql);
        $params = array(':i'=>$id, ':frtable'=>$fromtable, ':userI'=>$userId,':cont'=>$content);
        $stmt->execute($params);
    }
    function checkLimit500 ($dbh) {
        $sql = "SELECT * FROM adminlog WHERE fromtable='user_score'";
        $stmt = $dbh->query($sql);
        $allUser = [];
        $count = 0;
        foreach ($stmt as $row) {
            $allUser[] = $row;
            $count = $count + 1;
        }
        $allUser = array_reverse($allUser);
        if ($count > 500) {
            foreach ($allUser as $user) {
                $delete = $user['incre'];
            }
            $sql = "DELETE FROM adminlog WHERE incre='$delete'";
            $dbh->query($sql);
        }
    }
    if ($_GET['step'] === "score") {
        checkLimit500($dbh);
        $sql = "SELECT * FROM user where userId = '$userId'";
        $stmt = $dbh->query($sql);
        $yes = false;
        foreach ($stmt as $row) {
            $yes = true;
            $score = $row['score'];
        }
        if ($yes) {
            $minus = $_POST["minus"];
            $plus = $_POST["plus"];
            $newScore = intval($score) - intval($minus) + intval($plus);
            if ($newScore != $score) {
                $sql = "UPDATE user SET score = '$newScore' WHERE userId = '$userId'";
                $dbh->query($sql);

                $id = date("Y/m/d_H:i:s");
                $fromtable = "user_score";
                $content = "*".$userId."_(".$score." → ".$newScore.")";
                $sql = "INSERT INTO adminlog (id,fromtable,userId,content) VALUES (:i,:frtable,:userI,:cont)";
                $stmt = $dbh->prepare($sql);
                $params = array(':i'=>$id, ':frtable'=>$fromtable, ':userI'=>$userId,':cont'=>$content);
                $stmt->execute($params);
            }
        }
    }
    if ($_GET['step'] === "scores") {
        checkLimit500($dbh);
        $sql = "SELECT COUNT(*) FROM adminlog";
        $stmt = $dbh->query($sql);
        $count = intval($stmt->fetchColumn());
        if ($count > 5) {
            $sql = "DELETE TOP (1) FROM adminlog WHERE fromtable='user_score'";
            $dbh->query($sql);
        }

        $sql = "SELECT * FROM user";
        $stmt = $dbh->query($sql);
        $allUser = [];
        foreach ($stmt as $row) {
            $allUser[] = $row;
        }

        $userIdArray = explode(",", $_POST['userIdArray']);
        $minusArray = explode(",", $_POST['minusArray']);
        $plusArray = explode(",", $_POST['plusArray']);

        $count = count($userIdArray);
        $times = ceil($count/10);
        $id = date("Y/m/d_H:i:s");
        for ($i=0; $i<$times; $i++) {
            $lim = 10*$i+10;
            if ($lim > $count) {
                $lim = $count;
            }
            $content = "";
            for($j=10*$i; $j<$lim; $j++) {
                $userId = $userIdArray[$j];
                $minus = $minusArray[$j];
                $plus = $plusArray[$j];
    
                $yes = false;
                foreach ($allUser as $user) {
                    if ($userId === $user['userId']) {
                        $yes = true;
                        $score = $user['score'];
                    }
                }
                if ($yes) {
                    $newScore = intval($score) - intval($minus) + intval($plus);
                    $sql = "UPDATE user SET score = '$newScore' WHERE userId = '$userId'";
                    $dbh->query($sql);
                    $content = $content."*".$userId."_(".$score." → ".$newScore.") ";
                }
            }
            if ($content != "") {
                $fromtable = "user_score";
                $sql = "INSERT INTO adminlog (id,fromtable,userId,content) VALUES (:i,:frtable,:userI,:cont)";
                $stmt = $dbh->prepare($sql);
                $params = array(':i'=>$id, ':frtable'=>$fromtable, ':userI'=>"multi-user",':cont'=>$content);
                $stmt->execute($params);
            }
        }
    }
    if ($_GET['step'] === "question") {
        $content = $_POST['content'];
        $keyWord = $_POST['keyWord'];
        $id = date("Y/m/d H:i");

        $sql = "INSERT INTO question (id,userId,keyword,content) VALUES (:i,:userI,:ke,:cont)";
        $stmt = $dbh->prepare($sql);
        $params = array(':i'=>$id, ':userI'=>$userId, ':ke'=>$keyWord, ':cont'=>$content);
        $stmt->execute($params);
    }
    if ($_GET['step'] === "answer") {
        $id = date("Y/m/d H:i");
        $quesIncre = $_POST['quesIncre'];
        $content = $_POST['content'];

        $sql = "INSERT INTO answer (id,quesIncre,userId,content) VALUES (:i,:quesI,:userI,:cont)";
        $stmt = $dbh->prepare($sql);
        $params = array(':i'=>$id, ':quesI'=>$quesIncre, ':userI'=>$userId, ':cont'=>$content);
        $stmt->execute($params);
    }
    if ($_GET['step'] === "questionEdit") {
        $incre = $_POST['incre'];
        $content = $_POST['content'];

        $sql = "SELECT * FROM user";
        $stmt = $dbh->query($sql);
        $yes = false;
        foreach ($stmt as $row) {
            if ($userId === $row['userId']) {
                $yes = true;
            }
        }
        if ($yes) {
            $id = date("Y/m/d H:i");
            $sql = "UPDATE question SET content = '$content', id = '$id' WHERE incre = '$incre'";
            $dbh->query($sql);
        }
    }
    if ($_GET['step'] === "queAnsDelete") {
        $sql = "SELECT * FROM user";
        $stmt = $dbh->query($sql);
        $yes = false;
        foreach ($stmt as $row) {
            if ($userId === $row['userId']) {
                $yes = true;
            }
        } 
        if ($userId === "ADMIN") {$yes = true;}
        if ($yes) {
            $table = $_POST['table'];
            $incre = $_POST['incre'];
            $sql = "DELETE FROM $table WHERE incre = '$incre'";
            $dbh->query($sql);
            if ($table == "question") {
                $sql = "DELETE FROM answer WHERE quesIncre = '$incre'";
                $dbh->query($sql);
            }
        }
    }
}

?>