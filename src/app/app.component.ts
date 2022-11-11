import { Component, ViewChild, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import WebViewer, { Core, WebViewerInstance } from '@pdftron/webviewer';
import Annotation = Core.Annotations.Annotation;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('viewer') viewer: ElementRef;
  wvInstance: WebViewerInstance;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    const withMeasures = true;

    WebViewer({
      path: '../lib',
      initialDoc: '../files/sample_doc.pdf'
    }, this.viewer.nativeElement).then((instance) => {
      this.wvInstance = instance;

      const { documentViewer, Annotations, annotationManager, Math: { Point } } = instance.Core;

      documentViewer.addEventListener('documentLoaded', () => {
        const annotations: Annotation[] = [];
        for (let i = 0; i < 250; ++i) {
          const lineAnnotation = new Annotations.LineAnnotation({
            PageNumber: 1,
            Start: new Point(100, 100 + i * 4),
            End: new Point(500, 100 + i * 4),
            StrokeColor: new Annotations.Color(255, 0, 0, 1)
          });
          annotations.push(lineAnnotation);
        }
        for (let i = 0; i < 250; ++i) {
          const lineAnnotation = new Annotations.LineAnnotation({
            PageNumber: 1,
            Start: new Point(600, 100 + i * 4),
            End: new Point(1000, 100 + i * 4),
            StrokeColor: new Annotations.Color(255, 0, 0, 1)
          });
          if (withMeasures) {
            this.setMeasures(lineAnnotation);
          }
          annotations.push(lineAnnotation);
        }
        annotationManager.addAnnotations(annotations);
        annotationManager.showAnnotations(annotations);
      });
    });
  }

  setMeasures(annotation: Annotation) {
    const canvasDpi = 72;
    const scale = 0.25;
    const axisFactor = 1 / (canvasDpi * scale);

    annotation['IT'] = 'LineDimension';
    annotation['Measure'] = {
      scale: scale + ' in = 1 ft',
      axis: [
        {
          factor: axisFactor,
          unit: 'ft',
          decimalSymbol: '.',
          thousandsSymbol: ',',
          display: 'D',
          precision: 10
        }
      ],
      distance: [
        {
          factor: 1,
          unit: 'ft',
          decimalSymbol: '.',
          thousandsSymbol: ',',
          display: 'D',
          precision: 100
        }
      ],
      area: [
        {
          factor: 1,
          unit: 'ft',
          decimalSymbol: '.',
          thousandsSymbol: '',
          display: 'D',
          precision: 10
        }
      ]
    };

    annotation.adjustRect();
  }
}
