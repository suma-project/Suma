<?php

require_once 'BaseController.php';
require_once 'models/QueryModel.php';

require_once 'transformers/TransformerFactory.php';

Zend_Loader::loadClass('Zend_Date');

class QueryController extends BaseController
{

    private $_formats = array('alc', 'lac', 'lca', 'cal', 'cla', 'ac', 'lc');
    private $_transformers = array('cal' => 'CalTransformer',
                                   'cla' => 'CalTransformer',
                                   'alc' => 'AlcTransformer',
                                   'lac' => 'LacTransformer',
                                   'lca' => 'LcaTransformer',
                                   'ac'  => 'AcTransformer',
                                   'lc'  => 'LcTransformer');

    public function indexAction()
    {
    }

    public function initiativesAction()
    {
        $this->view->initiatives = QueryModel::getInitiatives();
    }

    public function debugsessionsAction()
    {
        $this->_setParam('service', 'debugsessions');
        $this->_forward('process');
    }

    public function debugcountsAction()
    {
        $this->_setParam('service', 'debugcounts');
        $this->_forward('process');
    }

    public function sessionsAction()
    {
        $initId = Zend_Filter::filterStatic($this->getRequest()->getParam('id'), 'StripTags');

        if ($initId)
        {
            $this->_setParam('service', 'sessions');
            $this->_forward('process');
        }
        else
        {
            $this->view->inits = QueryModel::getInitiatives();
        }
    }

    public function countsAction()
    {
        $initId = Zend_Filter::filterStatic($this->getRequest()->getParam('id'), 'StripTags');

        if ($initId)
        {
            $this->_setParam('service', 'counts');
            $this->_forward('process');
        }
        else
        {
            $this->view->inits = QueryModel::getInitiatives();
        }
    }

    public function processAction()
    {
        $initId = Zend_Filter::filterStatic($this->getRequest()->getParam('id'), 'StripTags');
        $sDate = Zend_Filter::filterStatic($this->getRequest()->getParam('sdate'), 'StripTags');
        $eDate = Zend_Filter::filterStatic($this->getRequest()->getParam('edate'), 'StripTags');
        $sTime = Zend_Filter::filterStatic($this->getRequest()->getParam('stime'), 'StripTags');
        $eTime = Zend_Filter::filterStatic($this->getRequest()->getParam('etime'), 'StripTags');
        $sum = Zend_Filter::filterStatic($this->getRequest()->getParam('sum'), 'StripTags');
        $format = Zend_Filter::filterStatic($this->getRequest()->getParam('format'), 'StripTags');
        $offset = Zend_Filter::filterStatic($this->getRequest()->getParam('offset'), 'StripTags');
        $limit = Zend_Filter::filterStatic($this->getRequest()->getParam('limit'), 'StripTags');

        $params = array();

        if (isset($initId) && ctype_digit($initId))
        {
            if (empty($format) || ! in_array($format, $this->_formats))
            {
                $format = 'cal';
            }

            $params['format'] = $format;
            $params['offset'] = (! empty($offset) && ctype_digit($offset)) ? (int)$offset : 0;
            $params['limit'] = (! empty($limit) && ctype_digit($limit)) ? (int)$limit : Globals::getQsDbLimit();

            if (! empty($sDate))
            {
                $sDate = explode("T", strtoupper($sDate));
                $yr = substr($sDate[0], 0, 4);
                $month = substr($sDate[0], 4, 2);
                $day = substr($sDate[0], 6, 2);

                if (ctype_digit($yr) && ctype_digit($month) && ctype_digit($day))
                {
                    $sDate = new Zend_Date(array('year' => $yr, 'month' => $month, 'day' => $day));
                    $params['sDate'] = $sDate->get(Zend_Date::ISO_8601);
                }
            }

            if (! empty($eDate))
            {
                $eDate = explode("T", strtoupper($eDate));
                $yr = substr($eDate[0], 0, 4);
                $month = substr($eDate[0], 4, 2);
                $day = substr($eDate[0], 6, 2);

                if (ctype_digit($yr) && ctype_digit($month) && ctype_digit($day))
                {
                    $eDate = new Zend_Date(array('year' => $yr, 'month' => $month, 'day' => $day));
                    if (is_object($sDate) && $eDate->isEarlier($sDate))
                    {
                        $this->view->error = 'End date must come after start date.';
                        $this->_forward("errorxhr", "error");
                    }
                    else
                    {
                        $params['eDate'] = $eDate->get(Zend_Date::ISO_8601);
                    }
                }
            }

            if (!empty($sTime) && ctype_digit($sTime) &&
                (int)$sTime > 0 && (int)$sTime < 2400)
            {
                $sTime = str_pad($sTime, 4, '0', STR_PAD_LEFT);
                $params['sTimeH'] = substr($sTime, 0, 2);
                $params['sTimeM'] = substr($sTime, 2, 2);
            }

            if (!empty($eTime) && ctype_digit($eTime) &&
                (int)$eTime >= 0 && (int)$eTime < 2359)
            {
                $sTime = str_pad($eTime, 4, '0', STR_PAD_LEFT);
                $params['eTimeH'] = substr($sTime, 0, 2);
                $params['eTimeM'] = substr($sTime, 2, 2);
            }


            try
            {
                $qModel = new QueryModel($initId);

                if ($this->_getParam('service') == 'debugsessions')
                {
                    $qModel->bySessions($params);
                    $this->view->qModel = $qModel;
                    $this->view->offset = $params['offset'];
                    $this->view->nextOffset = $params['offset'] + $params['limit'];
                    $this->view->prevOffset = ($params['offset'] - $params['limit'] > 0) ? $params['offset'] - $params['limit'] : 0;
                    $this->view->id = $initId;
                    $this->render('debugsessions');
                }
                else if ($this->_getParam('service') == 'debugcounts')
                {
                    $qModel->byCounts($params);
                    $this->view->qModel = $qModel;
                    $this->view->offset = $params['offset'];
                    $this->view->nextOffset = $params['offset'] + $params['limit'];
                    $this->view->prevOffset = ($params['offset'] - $params['limit'] > 0) ? $params['offset'] - $params['limit'] : 0;
                    $this->view->id = $initId;
                    $this->render('debugcounts');
                }
                else
                {
                    $sum = (strtolower($sum) === 'true') ? true : false;

                    if ($this->_getParam('service') == 'sessions')
                    {
                        $qModel->bySessions($params);
                        $trans = TransformerFactory::factory($this->_transformers[$format], false, $sum);
                    }
                    else
                    {
                        $qModel->byCounts($params);
                        $trans = TransformerFactory::factory($this->_transformers[$format], true, $sum);
                    }

                    $trans->setInitMetadata($qModel->getInitMetadata());
                    $trans->setInitLocs($qModel->getInitLocs());
                    $trans->setInitActs($qModel->getInitActs());
                    $trans->setInitActGroups($qModel->getInitActGroups());

                    while($row = $qModel->getNextRow())
                    {
                        $trans->addRow($row);
                    }

                    if ($qModel->hasMore())
                    {
                        $trans->setHasMore(true, ($params['offset']+$params['limit']));
                    }

                    $this->view->trans = $trans;
                }
            }
            catch (Exception $e)
            {
                $this->view->error = $e->getMessage();
                $this->_forward("error");
            }

        }
        else
        {
            $this->view->error = 'Initiative ID must be numeric';
            Globals::getLog()->err('INVALID INITIATIVE ID - QueryController id: '.$initId);
            $this->_forward("error");
        }

    }

    public function errorAction()
    {
    }

}
