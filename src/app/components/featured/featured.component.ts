import {Component, OnInit} from 'angular2/core';
import {FeaturedService} from '../../services/featured.service';

@Component({
  selector: 'catalog',
  templateUrl: 'app/components/featured/featured.component.html',
  styleUrls: ['app/components/featured/featured.component.css'],
})
export class FeaturedComponent implements OnInit {

  constructor(public featured: FeaturedService) {
  }

  ngOnInit() {
  }
}
